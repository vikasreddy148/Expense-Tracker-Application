package com.expensetracker.expensetracker.controller;

import com.expensetracker.expensetracker.dto.request.IncomeRequest;
import com.expensetracker.expensetracker.dto.request.FilterRequest;
import com.expensetracker.expensetracker.dto.response.IncomeResponse;
import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.service.AuthService;
import com.expensetracker.expensetracker.service.IncomeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;
    private final AuthService authService;

    public IncomeController(IncomeService incomeService, AuthService authService) {
        this.incomeService = incomeService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<IncomeResponse> addIncome(@Valid @RequestBody IncomeRequest request) {
        User currentUser = authService.getCurrentUser();
        IncomeResponse response = incomeService.addIncome(currentUser.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> getAllIncomes() {
        User currentUser = authService.getCurrentUser();
        List<IncomeResponse> incomes = incomeService.getIncomes(currentUser.getId());
        return ResponseEntity.ok(incomes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeResponse> getIncomeById(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        IncomeResponse income = incomeService.getIncomeById(currentUser.getId(), id);
        return ResponseEntity.ok(income);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest request) {
        User currentUser = authService.getCurrentUser();
        IncomeResponse response = incomeService.updateIncome(currentUser.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteIncome(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        incomeService.deleteIncome(currentUser.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Income deleted successfully"));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<IncomeResponse>> filterIncomes(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String minAmount,
            @RequestParam(required = false) String maxAmount) {
        
        User currentUser = authService.getCurrentUser();
        
        FilterRequest filterRequest = FilterRequest.builder()
                .source(source != null ? com.expensetracker.expensetracker.enums.IncomeSource.valueOf(source) : null)
                .startDate(startDate != null ? java.time.LocalDate.parse(startDate) : null)
                .endDate(endDate != null ? java.time.LocalDate.parse(endDate) : null)
                .minAmount(minAmount != null ? new java.math.BigDecimal(minAmount) : null)
                .maxAmount(maxAmount != null ? new java.math.BigDecimal(maxAmount) : null)
                .build();
        
        List<IncomeResponse> incomes = incomeService.filterIncomes(currentUser.getId(), filterRequest);
        return ResponseEntity.ok(incomes);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<IncomeResponse>> sortIncomes(
            @RequestParam String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        
        User currentUser = authService.getCurrentUser();
        List<IncomeResponse> incomes = incomeService.sortIncomes(currentUser.getId(), sortBy, order);
        return ResponseEntity.ok(incomes);
    }
}

