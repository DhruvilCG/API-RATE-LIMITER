package com.project.controller;

import com.project.entity.RequestLog;
import com.project.entity.User;
import com.project.service.AuthService;
import com.project.service.LogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/logs")
public class LogController {

    private final AuthService authService;
    private final LogService logService;

    public LogController(AuthService authService, LogService logService) {
        this.authService = authService;
        this.logService = logService;
    }

    @GetMapping
    public ResponseEntity<List<RequestLog>> getLogs(@RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.resolveUserFromApiKey(apiKey);
        return ResponseEntity.ok(logService.getLogs(user));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(@RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.resolveUserFromApiKey(apiKey);
        return ResponseEntity.ok(logService.getStats(user));
    }
}
