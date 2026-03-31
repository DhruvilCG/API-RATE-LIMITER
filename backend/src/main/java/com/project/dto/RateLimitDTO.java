package com.project.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RateLimitDTO {

    @NotNull(message = "limitCount is required")
    @Min(value = 1, message = "limitCount must be at least 1")
    private Integer limitCount;

    @NotNull(message = "timeWindow is required")
    @Min(value = 1, message = "timeWindow must be at least 1 second")
    private Long timeWindow;

    public Integer getLimitCount() {
        return limitCount;
    }

    public void setLimitCount(Integer limitCount) {
        this.limitCount = limitCount;
    }

    public Long getTimeWindow() {
        return timeWindow;
    }

    public void setTimeWindow(Long timeWindow) {
        this.timeWindow = timeWindow;
    }
}
