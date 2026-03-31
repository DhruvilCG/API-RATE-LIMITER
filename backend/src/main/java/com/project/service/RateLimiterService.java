package com.project.service;

import com.project.dto.RateLimitDTO;
import com.project.entity.RateLimitRule;
import com.project.entity.User;
import com.project.repository.RateLimitRepository;
import com.project.repository.RequestLogRepository;
import com.project.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RateLimiterService {

    private final RateLimitRepository rateLimitRepository;
    private final UserRepository userRepository;
    private final RequestLogRepository requestLogRepository;

    public RateLimiterService(
            RateLimitRepository rateLimitRepository,
            UserRepository userRepository,
            RequestLogRepository requestLogRepository
    ) {
        this.rateLimitRepository = rateLimitRepository;
        this.userRepository = userRepository;
        this.requestLogRepository = requestLogRepository;
    }

    public RateLimitRule createRule(Long userId, RateLimitDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        RateLimitRule rule = new RateLimitRule();
        rule.setUser(user);
        rule.setLimitCount(dto.getLimitCount());
        rule.setTimeWindow(dto.getTimeWindow());
        return rateLimitRepository.save(rule);
    }

    public List<RateLimitRule> getRules(Long userId) {
        return rateLimitRepository.findByUserId(userId);
    }

    public RateLimitRule updateRule(Long userId, Long ruleId, RateLimitDTO dto) {
        RateLimitRule rule = rateLimitRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("Rate limit rule not found."));

        if (!rule.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own rule.");
        }

        rule.setLimitCount(dto.getLimitCount());
        rule.setTimeWindow(dto.getTimeWindow());
        return rateLimitRepository.save(rule);
    }

    public void deleteRule(Long userId, Long ruleId) {
        RateLimitRule rule = rateLimitRepository.findById(ruleId)
                .orElseThrow(() -> new IllegalArgumentException("Rate limit rule not found."));

        if (!rule.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own rule.");
        }

        rateLimitRepository.delete(rule);
    }

    public boolean allowRequest(User user) {
        RateLimitRule rule = rateLimitRepository.findFirstByUserIdOrderByIdDesc(user.getId())
                .orElse(null);

        if (rule == null) {
            return true;
        }

        LocalDateTime windowStart = LocalDateTime.now().minusSeconds(rule.getTimeWindow());
        long requestCount = requestLogRepository.countByUserIdAndTimestampAfter(user.getId(), windowStart);
        return requestCount < rule.getLimitCount();
    }
}
