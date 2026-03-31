package com.project.service;

import com.project.entity.RequestLog;
import com.project.entity.User;
import com.project.repository.RequestLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class LogService {

    private final RequestLogRepository requestLogRepository;

    public LogService(RequestLogRepository requestLogRepository) {
        this.requestLogRepository = requestLogRepository;
    }

    public void logRequest(User user, String endpoint, String method, int status) {
        RequestLog log = new RequestLog();
        log.setUser(user);
        log.setEndpoint(endpoint);
        log.setMethod(method);
        log.setStatus(status);
        log.setTimestamp(LocalDateTime.now());
        requestLogRepository.save(log);
    }

    public List<RequestLog> getLogs(User user) {
        return requestLogRepository.findTop200ByUserIdOrderByTimestampDesc(user.getId());
    }

    public List<RequestLog> getAllLogs() {
        return requestLogRepository.findTop200ByOrderByTimestampDesc();
    }

    public Map<String, Long> getStats(User user) {
        long total = requestLogRepository.countByUserId(user.getId());
        long blocked = requestLogRepository.countByUserIdAndStatus(user.getId(), 429);
        return Map.of("total", total, "blocked", blocked, "allowed", total - blocked);
    }
}
