package com.expensetracker.expensetracker.dto.response;

import com.expensetracker.expensetracker.enums.ExpenseCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {

    private Long id;
    private String description;
    private ExpenseCategory category;
    private BigDecimal amount;
    private LocalDate dateOfExpense;
}

