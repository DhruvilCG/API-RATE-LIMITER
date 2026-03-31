package com.project.controller;

import com.project.entity.User;
import com.project.service.AnalyticsService;
import com.project.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AuthService authService;
    private final AnalyticsService analyticsService;

    public AnalyticsController(AuthService authService, AnalyticsService analyticsService) {
        this.authService = authService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary(@RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.resolveUserFromApiKey(apiKey);
        return ResponseEntity.ok(analyticsService.getSummary(user));
    }
}
