package com.expensetracker.expensetracker.service;

import com.expensetracker.expensetracker.dto.request.ExpenseRequest;
import com.expensetracker.expensetracker.dto.request.FilterRequest;
import com.expensetracker.expensetracker.dto.response.ExpenseResponse;
import com.expensetracker.expensetracker.entity.Expense;
import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.enums.ExpenseCategory;
import com.expensetracker.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.expensetracker.exception.UnauthorizedException;
import com.expensetracker.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final AuthService authService;

    public ExpenseService(ExpenseRepository expenseRepository, AuthService authService) {
        this.expenseRepository = expenseRepository;
        this.authService = authService;
    }

    @Transactional
    public ExpenseResponse addExpense(Long userId, ExpenseRequest request) {
        // Verify user authorization
        User user = verifyUserAuthorization(userId);

        Expense expense = Expense.builder()
                .user(user)
                .description(request.getDescription())
                .category(request.getCategory())
                .amount(request.getAmount())
                .dateOfExpense(request.getDateOfExpense())
                .build();

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    public List<ExpenseResponse> getExpenses(Long userId) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return expenses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse getExpenseById(Long userId, Long expenseId) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        // Verify ownership
        verifyUserOwnership(userId, expenseId);

        return mapToResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long userId, Long expenseId, ExpenseRequest request) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        // Verify ownership
        verifyUserOwnership(userId, expenseId);

        expense.setDescription(request.getDescription());
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setDateOfExpense(request.getDateOfExpense());

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    @Transactional
    public void deleteExpense(Long userId, Long expenseId) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        // Verify ownership
        verifyUserOwnership(userId, expenseId);

        expenseRepository.delete(expense);
    }

    public List<ExpenseResponse> filterExpenses(Long userId, FilterRequest filterRequest) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        List<Expense> expenses;

        ExpenseCategory category = filterRequest.getCategory();
        LocalDate startDate = filterRequest.getStartDate();
        LocalDate endDate = filterRequest.getEndDate();
        BigDecimal minAmount = filterRequest.getMinAmount();
        BigDecimal maxAmount = filterRequest.getMaxAmount();

        // Apply filters based on what's provided
        if (category != null && startDate != null && endDate != null && minAmount != null && maxAmount != null) {
            expenses = expenseRepository.findByUserIdAndCategoryAndDateOfExpenseBetweenAndAmountBetween(
                    userId, category, startDate, endDate, minAmount, maxAmount);
        } else if (category != null && startDate != null && endDate != null) {
            expenses = expenseRepository.findByUserIdAndCategoryAndDateOfExpenseBetween(
                    userId, category, startDate, endDate);
        } else if (category != null && minAmount != null && maxAmount != null) {
            expenses = expenseRepository.findByUserIdAndCategoryAndAmountBetween(
                    userId, category, minAmount, maxAmount);
        } else if (startDate != null && endDate != null && minAmount != null && maxAmount != null) {
            expenses = expenseRepository.findByUserIdAndDateOfExpenseBetweenAndAmountBetween(
                    userId, startDate, endDate, minAmount, maxAmount);
        } else if (category != null) {
            expenses = expenseRepository.findByUserIdAndCategory(userId, category);
        } else if (startDate != null && endDate != null) {
            expenses = expenseRepository.findByUserIdAndDateOfExpenseBetween(userId, startDate, endDate);
        } else if (minAmount != null && maxAmount != null) {
            expenses = expenseRepository.findByUserIdAndAmountBetween(userId, minAmount, maxAmount);
        } else {
            expenses = expenseRepository.findByUserId(userId);
        }

        return expenses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponse> sortExpenses(Long userId, String sortBy, String order) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        List<Expense> expenses;

        if ("amount".equalsIgnoreCase(sortBy)) {
            expenses = "desc".equalsIgnoreCase(order) ?
                    expenseRepository.findByUserIdOrderByAmountDesc(userId) :
                    expenseRepository.findByUserIdOrderByAmountAsc(userId);
        } else if ("date".equalsIgnoreCase(sortBy)) {
            expenses = "desc".equalsIgnoreCase(order) ?
                    expenseRepository.findByUserIdOrderByDateOfExpenseDesc(userId) :
                    expenseRepository.findByUserIdOrderByDateOfExpenseAsc(userId);
        } else if ("category".equalsIgnoreCase(sortBy)) {
            expenses = "desc".equalsIgnoreCase(order) ?
                    expenseRepository.findByUserIdOrderByCategoryDesc(userId) :
                    expenseRepository.findByUserIdOrderByCategoryAsc(userId);
        } else {
            expenses = expenseRepository.findByUserId(userId);
        }

        return expenses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void verifyUserOwnership(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        if (!expense.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to access this expense");
        }
    }

    private User verifyUserAuthorization(Long userId) {
        User currentUser = authService.getCurrentUser();
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to perform this action");
        }
        return currentUser;
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .description(expense.getDescription())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .dateOfExpense(expense.getDateOfExpense())
                .build();
    }
}

