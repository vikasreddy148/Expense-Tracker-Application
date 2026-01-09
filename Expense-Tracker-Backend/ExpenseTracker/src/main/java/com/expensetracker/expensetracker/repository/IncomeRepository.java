package com.expensetracker.expensetracker.repository;

import com.expensetracker.expensetracker.entity.Income;
import com.expensetracker.expensetracker.enums.IncomeSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    /**
     * Find all incomes for a specific user
     */
    List<Income> findByUserId(Long userId);

    /**
     * Find incomes by user ID and source
     */
    List<Income> findByUserIdAndSource(Long userId, IncomeSource source);

    /**
     * Find incomes by user ID within a date range
     */
    List<Income> findByUserIdAndDateOfIncomeBetween(Long userId, LocalDate startDate, LocalDate endDate);

    /**
     * Find incomes by user ID within an amount range
     */
    List<Income> findByUserIdAndAmountBetween(Long userId, BigDecimal minAmount, BigDecimal maxAmount);

    /**
     * Find incomes by user ID, source, and date range
     */
    List<Income> findByUserIdAndSourceAndDateOfIncomeBetween(
            Long userId, 
            IncomeSource source, 
            LocalDate startDate, 
            LocalDate endDate
    );

    /**
     * Find incomes by user ID, source, and amount range
     */
    List<Income> findByUserIdAndSourceAndAmountBetween(
            Long userId, 
            IncomeSource source, 
            BigDecimal minAmount, 
            BigDecimal maxAmount
    );

    /**
     * Find incomes by user ID, date range, and amount range
     */
    List<Income> findByUserIdAndDateOfIncomeBetweenAndAmountBetween(
            Long userId, 
            LocalDate startDate, 
            LocalDate endDate, 
            BigDecimal minAmount, 
            BigDecimal maxAmount
    );

    /**
     * Find incomes by user ID with all filters (source, date range, amount range)
     */
    List<Income> findByUserIdAndSourceAndDateOfIncomeBetweenAndAmountBetween(
            Long userId, 
            IncomeSource source, 
            LocalDate startDate, 
            LocalDate endDate, 
            BigDecimal minAmount, 
            BigDecimal maxAmount
    );

    /**
     * Find incomes by user ID, sorted by amount (ascending)
     */
    List<Income> findByUserIdOrderByAmountAsc(Long userId);

    /**
     * Find incomes by user ID, sorted by amount (descending)
     */
    List<Income> findByUserIdOrderByAmountDesc(Long userId);

    /**
     * Find incomes by user ID, sorted by date (ascending)
     */
    List<Income> findByUserIdOrderByDateOfIncomeAsc(Long userId);

    /**
     * Find incomes by user ID, sorted by date (descending)
     */
    List<Income> findByUserIdOrderByDateOfIncomeDesc(Long userId);

    /**
     * Find incomes by user ID, sorted by source (ascending)
     */
    List<Income> findByUserIdOrderBySourceAsc(Long userId);

    /**
     * Find incomes by user ID, sorted by source (descending)
     */
    List<Income> findByUserIdOrderBySourceDesc(Long userId);

    /**
     * Calculate total income amount for a user
     */
    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId")
    BigDecimal calculateTotalIncomeByUserId(@Param("userId") Long userId);

    /**
     * Calculate total income amount for a user within date range
     */
    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId " +
           "AND i.dateOfIncome BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalIncomeByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Count incomes by user ID
     */
    long countByUserId(Long userId);
}

