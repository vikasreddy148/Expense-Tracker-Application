package com.expensetracker.expensetracker.dto.response;

import com.expensetracker.expensetracker.enums.IncomeSource;
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
public class IncomeResponse {

    private Long id;
    private String description;
    private IncomeSource source;
    private BigDecimal amount;
    private LocalDate dateOfIncome;
}

