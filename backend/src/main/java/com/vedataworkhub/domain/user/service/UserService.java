package com.vedataworkhub.domain.user.service;

import com.vedataworkhub.domain.user.dto.UserRegistrationDto;
import com.vedataworkhub.domain.user.model.User;
import com.vedataworkhub.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(UserRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado: " + dto.getEmail());
        }

        User user = User.builder()
            .name(dto.getName())
            .email(dto.getEmail())
            .password(passwordEncoder.encode(dto.getPassword()))
            .role(User.Role.MEMBER)
            .active(true)
            .build();

        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAll() {
        return userRepository.findByActiveTrue();
    }

    public User updateProfile(User user, String name, String avatarUrl) {
        user.setName(name);
        if (avatarUrl != null && !avatarUrl.isBlank()) {
            user.setAvatarUrl(avatarUrl);
        }
        return userRepository.save(user);
    }

    public User changePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    public void toggleActive(Long userId) {
        userRepository.findById(userId).ifPresent(u -> {
            u.setActive(!u.getActive());
            userRepository.save(u);
        });
    }

    public User promoteToAdmin(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        user.setRole(User.Role.ADMIN);
        return userRepository.save(user);
    }
}
