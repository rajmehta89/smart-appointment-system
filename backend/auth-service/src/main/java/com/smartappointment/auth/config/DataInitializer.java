package com.smartappointment.auth.config;

import com.smartappointment.auth.entity.User;
import com.smartappointment.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DataInitializer {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                // Create test user if it doesn't exist
                if (!userRepository.findByEmail("admin@example.com").isPresent()) {
                    User admin = User.builder()
                            .name("Admin User")
                            .email("admin@example.com")
                            .password(passwordEncoder.encode("admin123"))
                            .role("ADMIN")
                            .build();
                    userRepository.save(admin);
                    logger.info("Created admin user: admin@example.com");
                }
            } catch (Exception e) {
                logger.error("Error initializing database: {}", e.getMessage());
            }
        };
    }
} 