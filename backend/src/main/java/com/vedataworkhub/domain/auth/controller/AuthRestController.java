package com.vedataworkhub.domain.auth.controller;

import com.vedataworkhub.domain.auth.dto.AuthResponseDto;
import com.vedataworkhub.domain.auth.dto.LoginRequestDto;
import com.vedataworkhub.domain.auth.provider.JwtTokenProvider;
import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.user.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {

    private static final Logger logger = LoggerFactory.getLogger(AuthRestController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        logger.info("🔑 Tentativa de login: {}", loginRequest.getEmail());

        // Buscar usuário pelo email
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            logger.warn("❌ Usuário não encontrado: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Email ou senha inválidos\"}");
        }

        User user = userOpt.get();

        // Validar senha
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            logger.warn("❌ Senha incorreta para: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Email ou senha inválidos\"}");
        }

        // Gerar token JWT
        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().toString()
        );

        // Preparar response
        AuthResponseDto response = AuthResponseDto.builder()
                .token(token)
                .user(AuthResponseDto.UserInfoDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().toString())
                        .build())
                .build();

        logger.info("✅ Login bem-sucedido para: {}", loginRequest.getEmail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        logger.info("📍 Verificando usuário atual");

        // Validar header de Authorization
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("❌ Token JWT ausente ou inválido");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Token não fornecido\"}");
        }

        // Extrair token
        String token = authHeader.substring(7);

        // Validar token
        if (!jwtTokenProvider.validateToken(token)) {
            logger.warn("❌ Token JWT inválido");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Token inválido ou expirado\"}");
        }

        // Buscar usuário pelo ID do token
        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        Optional<User> userOpt = userService.findById(userId);

        if (userOpt.isEmpty()) {
            logger.warn("❌ Usuário não encontrado: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"Usuário não encontrado\"}");
        }

        User user = userOpt.get();
        AuthResponseDto.UserInfoDto userInfo = AuthResponseDto.UserInfoDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .build();

        logger.info("✅ Usuário autenticado: {}", user.getEmail());
        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        logger.info("🚪 Logout realizado");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody LoginRequestDto registerRequest) {
        logger.info("📝 Tentativa de registro: {}", registerRequest.getEmail());

        // Validar se usuário já existe
        Optional<User> existingUser = userService.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent()) {
            logger.warn("❌ Email já cadastrado: {}", registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Email já cadastrado\"}");
        }

        try {
            // Buscar o nome a partir do email (usar como padrão)
            String name = registerRequest.getEmail().split("@")[0];

            // Criar novo usuário
            User newUser = User.builder()
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .name(name)
                    .role(User.Role.MEMBER)
                    .active(true)
                    .build();

            User savedUser = userService.register(
                    new com.vedataworkhub.domain.user.dto.UserRegistrationDto(
                            registerRequest.getEmail(),
                            registerRequest.getPassword(),
                            registerRequest.getPassword(),
                            name
                    )
            );

            // Gerar token
            String token = jwtTokenProvider.generateToken(
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getRole().toString()
            );

            // Preparar response
            AuthResponseDto response = AuthResponseDto.builder()
                    .token(token)
                    .user(AuthResponseDto.UserInfoDto.builder()
                            .id(savedUser.getId())
                            .name(savedUser.getName())
                            .email(savedUser.getEmail())
                            .role(savedUser.getRole().toString())
                            .build())
                    .build();

            logger.info("✅ Registro bem-sucedido para: {}", registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("❌ Erro ao registrar usuário: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Erro ao registrar: " + e.getMessage() + "\"}");
        }
    }
}
