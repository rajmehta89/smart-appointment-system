package com.smartappointment.auth.service;

import com.smartappointment.auth.dto.AuthenticationRequest;
import com.smartappointment.auth.dto.AuthenticationResponse;
import com.smartappointment.auth.dto.RegisterRequest;
import com.smartappointment.auth.entity.User;
import com.smartappointment.auth.repository.UserRepository;
import com.smartappointment.auth.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        // Validate email format
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Validate password strength
        if (!isPasswordStrong(request.getPassword())) {
            throw new IllegalArgumentException("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Check if phone number already exists (if provided)
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            if (!request.getPhoneNumber().matches("^\\+?[1-9]\\d{1,14}$")) {
                throw new IllegalArgumentException("Invalid phone number format");
            }
            if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                throw new IllegalArgumentException("Phone number already registered");
            }
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role("USER")
                .build();

        user = userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .fullName(user.getName())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase(),
                            request.getPassword()
                    )
            );

            User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            if (!user.isActive()) {
                throw new BadCredentialsException("Account is disabled");
            }

            String jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .email(user.getEmail())
                    .fullName(user.getName())
                    .build();
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    private boolean isPasswordStrong(String password) {
        // Password must be at least 8 characters long and contain:
        // - At least one uppercase letter
        // - At least one lowercase letter
        // - At least one number
        // - At least one special character
        String passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
        return password.matches(passwordRegex);
    }
} 