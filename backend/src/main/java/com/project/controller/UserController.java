package com.project.controller;

import com.project.entity.User;
import com.project.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/api-key")
    public ResponseEntity<Map<String, String>> getApiKey(@RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.resolveUserFromApiKey(apiKey);
        return ResponseEntity.ok(Map.of("apiKey", user.getApiKey(), "email", user.getEmail()));
    }
}
