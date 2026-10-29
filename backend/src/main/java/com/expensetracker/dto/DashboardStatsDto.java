package com.expensetracker.dto;

import com.expensetracker.model.Expense;
import java.util.List;

public class DashboardStatsDto {
    private Double totalExpense;
    private Double currentMonthExpense;
    private Double monthlyBudget;
    private Double remainingBudget;
    private Double budgetUsedPercentage;
    private Long totalTransactions;
    private List<CategorySpendingDto> categoryBreakdown;
    private List<Expense> recentExpenses;

    public DashboardStatsDto() {
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public Double getCurrentMonthExpense() {
        return currentMonthExpense;
    }

    public void setCurrentMonthExpense(Double currentMonthExpense) {
        this.currentMonthExpense = currentMonthExpense;
    }

    public Double getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(Double monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public Double getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(Double remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public Double getBudgetUsedPercentage() {
        return budgetUsedPercentage;
    }

    public void setBudgetUsedPercentage(Double budgetUsedPercentage) {
        this.budgetUsedPercentage = budgetUsedPercentage;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public List<CategorySpendingDto> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategorySpendingDto> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<Expense> getRecentExpenses() {
        return recentExpenses;
    }

    public void setRecentExpenses(List<Expense> recentExpenses) {
        this.recentExpenses = recentExpenses;
    }
}
