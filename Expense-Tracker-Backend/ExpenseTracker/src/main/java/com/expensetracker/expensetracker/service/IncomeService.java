package com.expensetracker.expensetracker.service;

import com.expensetracker.expensetracker.dto.request.IncomeRequest;
import com.expensetracker.expensetracker.dto.request.FilterRequest;
import com.expensetracker.expensetracker.dto.response.IncomeResponse;
import com.expensetracker.expensetracker.entity.Income;
import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.enums.IncomeSource;
import com.expensetracker.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.expensetracker.exception.UnauthorizedException;
import com.expensetracker.expensetracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final AuthService authService;

    public IncomeService(IncomeRepository incomeRepository, AuthService authService) {
        this.incomeRepository = incomeRepository;
        this.authService = authService;
    }

    @Transactional
    public IncomeResponse addIncome(Long userId, IncomeRequest request) {
        // Verify user authorization
        User user = verifyUserAuthorization(userId);

        Income income = Income.builder()
                .user(user)
                .description(request.getDescription())
                .source(request.getSource())
                .amount(request.getAmount())
                .dateOfIncome(request.getDateOfIncome())
                .build();

        income = incomeRepository.save(income);
        return mapToResponse(income);
    }

    public List<IncomeResponse> getIncomes(Long userId) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        List<Income> incomes = incomeRepository.findByUserId(userId);
        return incomes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public IncomeResponse getIncomeById(Long userId, Long incomeId) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + incomeId));

        // Verify ownership
        verifyUserOwnership(userId, incomeId);

        return mapToResponse(income);
    }

    @Transactional
    public IncomeResponse updateIncome(Long userId, Long incomeId, IncomeRequest request) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + incomeId));

        // Verify ownership
        verifyUserOwnership(userId, incomeId);

        income.setDescription(request.getDescription());
        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setDateOfIncome(request.getDateOfIncome());

        income = incomeRepository.save(income);
        return mapToResponse(income);
    }

    @Transactional
    public void deleteIncome(Long userId, Long incomeId) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + incomeId));

        // Verify ownership
        verifyUserOwnership(userId, incomeId);

        incomeRepository.delete(income);
    }

    public List<IncomeResponse> filterIncomes(Long userId, FilterRequest filterRequest) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        List<Income> incomes;

        IncomeSource source = filterRequest.getSource();
        LocalDate startDate = filterRequest.getStartDate();
        LocalDate endDate = filterRequest.getEndDate();
        BigDecimal minAmount = filterRequest.getMinAmount();
        BigDecimal maxAmount = filterRequest.getMaxAmount();

        // Apply filters based on what's provided
        if (source != null && startDate != null && endDate != null && minAmount != null && maxAmount != null) {
            incomes = incomeRepository.findByUserIdAndSourceAndDateOfIncomeBetweenAndAmountBetween(
                    userId, source, startDate, endDate, minAmount, maxAmount);
        } else if (source != null && startDate != null && endDate != null) {
            incomes = incomeRepository.findByUserIdAndSourceAndDateOfIncomeBetween(
                    userId, source, startDate, endDate);
        } else if (source != null && minAmount != null && maxAmount != null) {
            incomes = incomeRepository.findByUserIdAndSourceAndAmountBetween(
                    userId, source, minAmount, maxAmount);
        } else if (startDate != null && endDate != null && minAmount != null && maxAmount != null) {
            incomes = incomeRepository.findByUserIdAndDateOfIncomeBetweenAndAmountBetween(
                    userId, startDate, endDate, minAmount, maxAmount);
        } else if (source != null) {
            incomes = incomeRepository.findByUserIdAndSource(userId, source);
        } else if (startDate != null && endDate != null) {
            incomes = incomeRepository.findByUserIdAndDateOfIncomeBetween(userId, startDate, endDate);
        } else if (minAmount != null && maxAmount != null) {
            incomes = incomeRepository.findByUserIdAndAmountBetween(userId, minAmount, maxAmount);
        } else {
            incomes = incomeRepository.findByUserId(userId);
        }

        return incomes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<IncomeResponse> sortIncomes(Long userId, String sortBy, String order) {
        // Verify user authorization
        verifyUserAuthorization(userId);

        List<Income> incomes;

        if ("amount".equalsIgnoreCase(sortBy)) {
            incomes = "desc".equalsIgnoreCase(order) ?
                    incomeRepository.findByUserIdOrderByAmountDesc(userId) :
                    incomeRepository.findByUserIdOrderByAmountAsc(userId);
        } else if ("date".equalsIgnoreCase(sortBy)) {
            incomes = "desc".equalsIgnoreCase(order) ?
                    incomeRepository.findByUserIdOrderByDateOfIncomeDesc(userId) :
                    incomeRepository.findByUserIdOrderByDateOfIncomeAsc(userId);
        } else if ("source".equalsIgnoreCase(sortBy)) {
            incomes = "desc".equalsIgnoreCase(order) ?
                    incomeRepository.findByUserIdOrderBySourceDesc(userId) :
                    incomeRepository.findByUserIdOrderBySourceAsc(userId);
        } else {
            incomes = incomeRepository.findByUserId(userId);
        }

        return incomes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void verifyUserOwnership(Long userId, Long incomeId) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + incomeId));

        if (!income.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to access this income");
        }
    }

    private User verifyUserAuthorization(Long userId) {
        User currentUser = authService.getCurrentUser();
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to perform this action");
        }
        return currentUser;
    }

    private IncomeResponse mapToResponse(Income income) {
        return IncomeResponse.builder()
                .id(income.getId())
                .description(income.getDescription())
                .source(income.getSource())
                .amount(income.getAmount())
                .dateOfIncome(income.getDateOfIncome())
                .build();
    }
}

