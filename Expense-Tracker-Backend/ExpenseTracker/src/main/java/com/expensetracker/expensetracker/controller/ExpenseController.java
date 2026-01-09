package com.expensetracker.expensetracker.controller;

import com.expensetracker.expensetracker.dto.request.ExpenseRequest;
import com.expensetracker.expensetracker.dto.request.FilterRequest;
import com.expensetracker.expensetracker.dto.response.ExpenseResponse;
import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.service.AuthService;
import com.expensetracker.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final AuthService authService;

    public ExpenseController(ExpenseService expenseService, AuthService authService) {
        this.expenseService = expenseService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@Valid @RequestBody ExpenseRequest request) {
        User currentUser = authService.getCurrentUser();
        ExpenseResponse response = expenseService.addExpense(currentUser.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {
        User currentUser = authService.getCurrentUser();
        List<ExpenseResponse> expenses = expenseService.getExpenses(currentUser.getId());
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        ExpenseResponse expense = expenseService.getExpenseById(currentUser.getId(), id);
        return ResponseEntity.ok(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request) {
        User currentUser = authService.getCurrentUser();
        ExpenseResponse response = expenseService.updateExpense(currentUser.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteExpense(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        expenseService.deleteExpense(currentUser.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Expense deleted successfully"));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ExpenseResponse>> filterExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String minAmount,
            @RequestParam(required = false) String maxAmount) {
        
        User currentUser = authService.getCurrentUser();
        
        FilterRequest filterRequest = FilterRequest.builder()
                .category(category != null ? com.expensetracker.expensetracker.enums.ExpenseCategory.valueOf(category) : null)
                .startDate(startDate != null ? java.time.LocalDate.parse(startDate) : null)
                .endDate(endDate != null ? java.time.LocalDate.parse(endDate) : null)
                .minAmount(minAmount != null ? new java.math.BigDecimal(minAmount) : null)
                .maxAmount(maxAmount != null ? new java.math.BigDecimal(maxAmount) : null)
                .build();
        
        List<ExpenseResponse> expenses = expenseService.filterExpenses(currentUser.getId(), filterRequest);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<ExpenseResponse>> sortExpenses(
            @RequestParam String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        
        User currentUser = authService.getCurrentUser();
        List<ExpenseResponse> expenses = expenseService.sortExpenses(currentUser.getId(), sortBy, order);
        return ResponseEntity.ok(expenses);
    }
}

