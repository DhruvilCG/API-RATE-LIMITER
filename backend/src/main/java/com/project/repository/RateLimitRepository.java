package com.project.repository;

import com.project.entity.RateLimitRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RateLimitRepository extends JpaRepository<RateLimitRule, Long> {
    List<RateLimitRule> findByUserId(Long userId);

    Optional<RateLimitRule> findFirstByUserIdOrderByIdDesc(Long userId);
}
