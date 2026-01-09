package com.expensetracker.expensetracker.controller;

import com.expensetracker.expensetracker.dto.response.PnLResponse;
import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.service.AuthService;
import com.expensetracker.expensetracker.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    public DashboardController(DashboardService dashboardService, AuthService authService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }

    @GetMapping("/pnl")
    public ResponseEntity<PnLResponse> getTotalPnL() {
        User currentUser = authService.getCurrentUser();
        PnLResponse pnl = dashboardService.calculatePnL(currentUser.getId());
        return ResponseEntity.ok(pnl);
    }

    @GetMapping("/pnl/range")
    public ResponseEntity<PnLResponse> getPnLByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        User currentUser = authService.getCurrentUser();
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        PnLResponse pnl = dashboardService.calculatePnLByDateRange(currentUser.getId(), start, end);
        return ResponseEntity.ok(pnl);
    }
}

