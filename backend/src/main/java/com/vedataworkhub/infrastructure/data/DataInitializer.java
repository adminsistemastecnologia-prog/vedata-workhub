package com.vedataworkhub.infrastructure.data;

import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("🚀 Iniciando inicialização de dados...");

        String adminEmail = "admin@vedata-workhub.com";
        Optional<User> adminOpt = userRepository.findByEmail(adminEmail);

        if (adminOpt.isEmpty()) {
            logger.info("👤 Criando usuário administrador padrão: {}", adminEmail);
            User admin = User.builder()
                    .name("Administrador")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("password"))
                    .role(User.Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            logger.info("✅ Usuário administrador criado com sucesso!");
        } else {
            logger.info("ℹ️ Usuário administrador já existe.");
        }
    }
}
