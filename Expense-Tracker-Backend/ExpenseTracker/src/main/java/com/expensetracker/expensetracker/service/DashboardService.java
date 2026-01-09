package com.expensetracker.expensetracker.service;

import com.expensetracker.expensetracker.dto.response.PnLResponse;
import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.exception.UnauthorizedException;
import com.expensetracker.expensetracker.repository.ExpenseRepository;
import com.expensetracker.expensetracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final AuthService authService;

    public DashboardService(IncomeRepository incomeRepository,
                           ExpenseRepository expenseRepository,
                           AuthService authService) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.authService = authService;
    }

    public PnLResponse calculatePnL(Long userId) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        BigDecimal totalIncome = incomeRepository.calculateTotalIncomeByUserId(userId);
        BigDecimal totalExpense = expenseRepository.calculateTotalExpenseByUserId(userId);
        BigDecimal profitLoss = totalIncome.subtract(totalExpense);

        return PnLResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .profitLoss(profitLoss)
                .build();
    }

    public PnLResponse calculatePnLByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        BigDecimal totalIncome = incomeRepository.calculateTotalIncomeByUserIdAndDateRange(
                userId, startDate, endDate);
        BigDecimal totalExpense = expenseRepository.calculateTotalExpenseByUserIdAndDateRange(
                userId, startDate, endDate);
        BigDecimal profitLoss = totalIncome.subtract(totalExpense);

        return PnLResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .profitLoss(profitLoss)
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }

    private void verifyUserAuthorization(Long userId) {
        User currentUser = authService.getCurrentUser();
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to perform this action");
        }
    }
}

