package com.expensetracker.expensetracker.dto.request;

import com.expensetracker.expensetracker.enums.IncomeSource;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncomeRequest {

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Source is required")
    private IncomeSource source;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Date of income is required")
    private LocalDate dateOfIncome;
}

