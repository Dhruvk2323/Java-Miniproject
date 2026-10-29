package com.expensetracker.service;

import com.expensetracker.dto.CategorySpendingDto;
import com.expensetracker.dto.DashboardStatsDto;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final UserService userService;

    public DashboardService(ExpenseRepository expenseRepository, UserService userService) {
        this.expenseRepository = expenseRepository;
        this.userService = userService;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        User user = userService.getDefaultUser();
        Double monthlyBudget = user.getMonthlyBudget() != null ? user.getMonthlyBudget() : 30000.0;
        stats.setMonthlyBudget(monthlyBudget);

        Double total = expenseRepository.calculateTotalExpense();
        stats.setTotalExpense(total != null ? total : 0.0);

        LocalDate now = LocalDate.now();
        LocalDate firstDay = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate lastDay = now.with(TemporalAdjusters.lastDayOfMonth());

        Double monthTotal = expenseRepository.calculateExpenseBetween(firstDay, lastDay);
        double currentMonthSpent = (monthTotal != null) ? monthTotal : 0.0;
        stats.setCurrentMonthExpense(currentMonthSpent);

        double remaining = monthlyBudget - currentMonthSpent;
        stats.setRemainingBudget(remaining);

        double pct = (monthlyBudget > 0) ? (currentMonthSpent / monthlyBudget) * 100.0 : 0.0;
        stats.setBudgetUsedPercentage(Math.round(pct * 10.0) / 10.0);

        stats.setTotalTransactions(expenseRepository.count());

        // Category breakdown
        List<Object[]> rows = expenseRepository.getCategoryBreakdown();
        List<CategorySpendingDto> breakdown = new ArrayList<>();
        double grandTotal = (total != null && total > 0) ? total : 1.0;

        for (Object[] r : rows) {
            String name = (String) r[0];
            String color = (String) r[1];
            String icon = (String) r[2];
            Double sum = ((Number) r[3]).doubleValue();
            Long count = ((Number) r[4]).longValue();
            double categoryPct = Math.round((sum / grandTotal) * 1000.0) / 10.0;

            breakdown.add(new CategorySpendingDto(name, color, icon, sum, count, categoryPct));
        }
        stats.setCategoryBreakdown(breakdown);

        // Recent 5 transactions
        stats.setRecentExpenses(expenseRepository.findTop5ByOrderByExpenseDateDescCreatedAtDesc());

        return stats;
    }
}
