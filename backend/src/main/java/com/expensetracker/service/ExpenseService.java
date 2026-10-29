package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequestDto;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryService categoryService;
    private final UserService userService;

    public ExpenseService(ExpenseRepository expenseRepository,
                          CategoryService categoryService,
                          UserService userService) {
        this.expenseRepository = expenseRepository;
        this.categoryService = categoryService;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAllByOrderByExpenseDateDesc();
    }

    @Transactional(readOnly = true)
    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Expense> filterExpenses(String search, Long categoryId, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findAllByOrderByExpenseDateDesc();

        return expenses.stream()
                .filter(e -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String q = search.trim().toLowerCase();
                    return (e.getTitle() != null && e.getTitle().toLowerCase().contains(q)) ||
                           (e.getNotes() != null && e.getNotes().toLowerCase().contains(q)) ||
                           (e.getPaymentMethod() != null && e.getPaymentMethod().toLowerCase().contains(q));
                })
                .filter(e -> {
                    if (categoryId == null || categoryId <= 0) return true;
                    return e.getCategory() != null && e.getCategory().getId().equals(categoryId);
                })
                .filter(e -> {
                    if (startDate == null) return true;
                    return !e.getExpenseDate().isBefore(startDate);
                })
                .filter(e -> {
                    if (endDate == null) return true;
                    return !e.getExpenseDate().isAfter(endDate);
                })
                .collect(Collectors.toList());
    }

    public Expense createExpense(ExpenseRequestDto dto) {
        Category category = categoryService.getCategoryById(dto.getCategoryId());
        User user = userService.getDefaultUser();

        Expense expense = new Expense();
        expense.setTitle(dto.getTitle());
        expense.setAmount(dto.getAmount());
        expense.setCategory(category);
        expense.setUser(user);
        expense.setExpenseDate(dto.getExpenseDate());
        expense.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "UPI");
        expense.setNotes(dto.getNotes());
        expense.setCreatedAt(LocalDateTime.now());

        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, ExpenseRequestDto dto) {
        Expense expense = getExpenseById(id);
        Category category = categoryService.getCategoryById(dto.getCategoryId());

        expense.setTitle(dto.getTitle());
        expense.setAmount(dto.getAmount());
        expense.setCategory(category);
        expense.setExpenseDate(dto.getExpenseDate());
        expense.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "UPI");
        expense.setNotes(dto.getNotes());

        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: Expense not found with ID: " + id);
        }
        expenseRepository.deleteById(id);
    }
}
