package com.shelfd.controller;

import com.shelfd.dto.MonthlyStatsResponse;
import com.shelfd.entity.User;
import com.shelfd.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyStatsResponse> getMonthlyStats(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(statsService.getMonthlyStatsForUser(currentUser));
    }
}
