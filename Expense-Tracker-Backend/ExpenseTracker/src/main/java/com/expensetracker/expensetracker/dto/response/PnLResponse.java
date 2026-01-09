package com.expensetracker.expensetracker.dto.response;

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
public class PnLResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal profitLoss;
    
    // Optional: Date range for filtered PnL
    private LocalDate startDate;
    private LocalDate endDate;
}

