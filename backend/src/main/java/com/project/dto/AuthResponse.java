package com.project.dto;

public class AuthResponse {
    private String message;
    private Long userId;
    private String email;
    private String apiKey;

    public AuthResponse() {
    }

    public AuthResponse(String message, Long userId, String email, String apiKey) {
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.apiKey = apiKey;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
