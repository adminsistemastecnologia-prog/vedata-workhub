package com.vedataworkhub.infrastructure.security;

import com.vedataworkhub.domain.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.info("🔐 Tentando carregar usuário com email: {}", email);
        
        return userRepository.findByEmail(email)
            .map(user -> {
                logger.info("✅ Usuário encontrado no banco: {} | Active: {} | Role: {}", 
                    email, user.getActive(), user.getRole());
                logger.debug("   - ID: {} | Name: {}", user.getId(), user.getName());
                return user;
            })
            .orElseThrow(() -> {
                logger.warn("❌ Usuário NÃO encontrado no banco: {}", email);
                return new UsernameNotFoundException("Usuário não encontrado: " + email);
            });
    }
}
