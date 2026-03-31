package com.project.service;

import com.project.entity.User;
import com.project.repository.RequestLogRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    private final RequestLogRepository requestLogRepository;

    public AnalyticsService(RequestLogRepository requestLogRepository) {
        this.requestLogRepository = requestLogRepository;
    }

    public Map<String, Long> getSummary(User user) {
        long total = requestLogRepository.countByUserId(user.getId());
        long blocked = requestLogRepository.countByUserIdAndStatus(user.getId(), 429);
        long success = requestLogRepository.countByUserIdAndStatusBetween(user.getId(), 200, 399);
        long failed = total - success;

        Map<String, Long> summary = new LinkedHashMap<>();
        summary.put("totalRequests", total);
        summary.put("allowedRequests", total - blocked);
        summary.put("blockedRequests", blocked);
        summary.put("successfulResponses", success);
        summary.put("failedResponses", failed);
        return summary;
    }
}
