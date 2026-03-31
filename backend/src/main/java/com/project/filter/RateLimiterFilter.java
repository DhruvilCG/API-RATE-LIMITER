package com.project.filter;

import com.project.entity.User;
import com.project.repository.UserRepository;
import com.project.service.LogService;
import com.project.service.RateLimiterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimiterFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final RateLimiterService rateLimiterService;
    private final LogService logService;

    public RateLimiterFilter(
            UserRepository userRepository,
            RateLimiterService rateLimiterService,
            LogService logService
    ) {
        this.userRepository = userRepository;
        this.rateLimiterService = rateLimiterService;
        this.logService = logService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/auth") || path.startsWith("/error") || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String apiKey = request.getHeader("X-API-KEY");

        if (apiKey == null || apiKey.isBlank()) {
            writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Missing API key.");
            return;
        }

        User user = userRepository.findByApiKey(apiKey).orElse(null);
        if (user == null) {
            writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid API key.");
            return;
        }

        if (!rateLimiterService.allowRequest(user)) {
            logService.logRequest(user, request.getRequestURI(), request.getMethod(), 429);
            writeError(response, 429, "Rate limit exceeded.");
            return;
        }

        filterChain.doFilter(request, response);
        logService.logRequest(user, request.getRequestURI(), request.getMethod(), response.getStatus());
    }

    private void writeError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"status\":" + status + ",\"message\":\"" + message + "\"}");
    }
}
