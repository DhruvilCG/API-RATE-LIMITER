package com.project.repository;

import com.project.entity.RequestLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
    long countByUserIdAndTimestampAfter(Long userId, LocalDateTime timestamp);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, Integer status);

    long countByUserIdAndStatusBetween(Long userId, Integer fromStatus, Integer toStatus);

    List<RequestLog> findTop200ByOrderByTimestampDesc();

    List<RequestLog> findTop200ByUserIdOrderByTimestampDesc(Long userId);
}
