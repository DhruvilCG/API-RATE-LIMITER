package com.project.service;

import com.project.dto.AuthRequest;
import com.project.dto.AuthResponse;
import com.project.entity.User;
import com.project.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(AuthRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required for registration.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setApiKey(UUID.randomUUID().toString());

        User savedUser = userRepository.save(user);
        return new AuthResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getApiKey()
        );
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return new AuthResponse("Login successful", user.getId(), user.getEmail(), user.getApiKey());
    }

    public User resolveUserFromApiKey(String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalArgumentException("API key is required.");
        }
        return userRepository.findByApiKey(apiKey)
                .orElseThrow(() -> new IllegalArgumentException("Invalid API key."));
    }
}
