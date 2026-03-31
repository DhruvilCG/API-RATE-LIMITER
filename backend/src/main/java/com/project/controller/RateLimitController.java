package com.project.controller;

import com.project.dto.RateLimitDTO;
import com.project.entity.RateLimitRule;
import com.project.entity.User;
import com.project.service.AuthService;
import com.project.service.RateLimiterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rate-limit")
public class RateLimitController {

    private final AuthService authService;
    private final RateLimiterService rateLimiterService;

    public RateLimitController(AuthService authService, RateLimiterService rateLimiterService) {
        this.authService = authService;
        this.rateLimiterService = rateLimiterService;
    }

    @PostMapping
    public ResponseEntity<RateLimitRule> createRule(
            @RequestHeader("X-API-KEY") String apiKey,
            @Valid @RequestBody RateLimitDTO request
    ) {
        User user = authService.resolveUserFromApiKey(apiKey);
        return ResponseEntity.ok(rateLimiterService.createRule(user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<RateLimitRule>> getRules(@RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.resolveUserFromApiKey(apiKey);
        return ResponseEntity.ok(rateLimiterService.getRules(user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RateLimitRule> updateRule(
            @RequestHeader("X-API-KEY") String apiKey,
            @PathVariable Long id,
            @Valid @RequestBody RateLimitDTO request
    ) {
        User user = authService.resolveUserFromApiKey(apiKey);
        return ResponseEntity.ok(rateLimiterService.updateRule(user.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@RequestHeader("X-API-KEY") String apiKey, @PathVariable Long id) {
        User user = authService.resolveUserFromApiKey(apiKey);
        rateLimiterService.deleteRule(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
