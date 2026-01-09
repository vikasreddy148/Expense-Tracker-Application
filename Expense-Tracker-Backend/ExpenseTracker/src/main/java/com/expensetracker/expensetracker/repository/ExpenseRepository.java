package com.expensetracker.expensetracker.repository;

import com.expensetracker.expensetracker.entity.Expense;
import com.expensetracker.expensetracker.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Find all expenses for a specific user
     */
    List<Expense> findByUserId(Long userId);

    /**
     * Find expenses by user ID and category
     */
    List<Expense> findByUserIdAndCategory(Long userId, ExpenseCategory category);

    /**
     * Find expenses by user ID within a date range
     */
    List<Expense> findByUserIdAndDateOfExpenseBetween(Long userId, LocalDate startDate, LocalDate endDate);

    /**
     * Find expenses by user ID within an amount range
     */
    List<Expense> findByUserIdAndAmountBetween(Long userId, BigDecimal minAmount, BigDecimal maxAmount);

    /**
     * Find expenses by user ID, category, and date range
     */
    List<Expense> findByUserIdAndCategoryAndDateOfExpenseBetween(
            Long userId, 
            ExpenseCategory category, 
            LocalDate startDate, 
            LocalDate endDate
    );

    /**
     * Find expenses by user ID, category, and amount range
     */
    List<Expense> findByUserIdAndCategoryAndAmountBetween(
            Long userId, 
            ExpenseCategory category, 
            BigDecimal minAmount, 
            BigDecimal maxAmount
    );

    /**
     * Find expenses by user ID, date range, and amount range
     */
    List<Expense> findByUserIdAndDateOfExpenseBetweenAndAmountBetween(
            Long userId, 
            LocalDate startDate, 
            LocalDate endDate, 
            BigDecimal minAmount, 
            BigDecimal maxAmount
    );

    /**
     * Find expenses by user ID with all filters (category, date range, amount range)
     */
    List<Expense> findByUserIdAndCategoryAndDateOfExpenseBetweenAndAmountBetween(
            Long userId, 
            ExpenseCategory category, 
            LocalDate startDate, 
            LocalDate endDate, 
            BigDecimal minAmount, 
            BigDecimal maxAmount
    );

    /**
     * Find expenses by user ID, sorted by amount (ascending)
     */
    List<Expense> findByUserIdOrderByAmountAsc(Long userId);

    /**
     * Find expenses by user ID, sorted by amount (descending)
     */
    List<Expense> findByUserIdOrderByAmountDesc(Long userId);

    /**
     * Find expenses by user ID, sorted by date (ascending)
     */
    List<Expense> findByUserIdOrderByDateOfExpenseAsc(Long userId);

    /**
     * Find expenses by user ID, sorted by date (descending)
     */
    List<Expense> findByUserIdOrderByDateOfExpenseDesc(Long userId);

    /**
     * Find expenses by user ID, sorted by category (ascending)
     */
    List<Expense> findByUserIdOrderByCategoryAsc(Long userId);

    /**
     * Find expenses by user ID, sorted by category (descending)
     */
    List<Expense> findByUserIdOrderByCategoryDesc(Long userId);

    /**
     * Calculate total expense amount for a user
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal calculateTotalExpenseByUserId(@Param("userId") Long userId);

    /**
     * Calculate total expense amount for a user within date range
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId " +
           "AND e.dateOfExpense BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalExpenseByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Count expenses by user ID
     */
    long countByUserId(Long userId);
}

