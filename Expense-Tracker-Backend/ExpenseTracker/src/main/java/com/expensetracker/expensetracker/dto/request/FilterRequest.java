package com.expensetracker.expensetracker.dto.request;

import com.expensetracker.expensetracker.enums.ExpenseCategory;
import com.expensetracker.expensetracker.enums.IncomeSource;
import jakarta.validation.constraints.DecimalMin;
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
public class FilterRequest {

    /**
     * Filter type: "EXPENSE" or "INCOME"
     */
    private String type;

    /**
     * Category for expenses (PERSONAL, SURVIVAL_LIVELIHOOD, INVESTMENT)
     */
    private ExpenseCategory category;

    /**
     * Source for incomes (FROM_INVESTMENT, SALARY, FROM_TRADING)
     */
    private IncomeSource source;

    /**
     * Start date for date range filter
     */
    private LocalDate startDate;

    /**
     * End date for date range filter
     */
    private LocalDate endDate;

    /**
     * Minimum amount filter
     */
    @DecimalMin(value = "0.0", message = "Minimum amount must be 0 or greater")
    private BigDecimal minAmount;

    /**
     * Maximum amount filter
     */
    @DecimalMin(value = "0.0", message = "Maximum amount must be 0 or greater")
    private BigDecimal maxAmount;
}

