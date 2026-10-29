package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByExpenseDateDesc();

    List<Expense> findByTitleContainingIgnoreCaseOrderByExpenseDateDesc(String keyword);

    List<Expense> findByCategoryIdOrderByExpenseDateDesc(Long categoryId);

    List<Expense> findByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e")
    Double calculateTotalExpense();

    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.expenseDate BETWEEN :start AND :end")
    Double calculateExpenseBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT e.category.name, e.category.color, e.category.icon, SUM(e.amount), COUNT(e) " +
           "FROM Expense e GROUP BY e.category.id, e.category.name, e.category.color, e.category.icon " +
           "ORDER BY SUM(e.amount) DESC")
    List<Object[]> getCategoryBreakdown();

    List<Expense> findTop5ByOrderByExpenseDateDescCreatedAtDesc();
}
