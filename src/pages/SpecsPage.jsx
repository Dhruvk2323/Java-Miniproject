import React from 'react';

export default function SpecsPage() {
  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>Full Stack Mini Project Specifications</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            React Frontend + Spring Boot / Servlet-JSP + MySQL Database Architecture
          </p>
        </div>
      </div>

      <div className="specs-grid">
        
        {/* Architecture Diagram */}
        <div className="transactions-card">
          <div className="card-title-main" style={{ marginBottom: '0.75rem' }}>
            📐 System Architecture Workflow
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            The application follows the industry-standard Model-View-Controller (MVC) 3-Tier Enterprise Web Pattern:
          </p>
          <div className="code-block" style={{ color: '#38bdf8' }}>
{`+-----------------------------------------------------------------------------------+
|                        CLIENT TIER (React / SPA Frontend)                         |
|   - SpendWise UI (HTML5 / Tailwind-style CSS / Chart.js Data Visualizations)      |
|   - RESTful Client Service (Fetch API / Axios / State Store)                      |
+----------------------------------------+------------------------------------------+
                                         | JSON via HTTP REST (CORS enabled)
                                         v
+-----------------------------------------------------------------------------------+
|               CONTROLLER & APPLICATION TIER (Spring Boot / Java EE)               |
|   - ExpenseController.java (@RestController / @CrossOrigin / @RequestMapping)     |
|   - AuthenticationService.java (JWT Token / Session Validation)                   |
|   - Business Service: ExpenseService.java & BudgetCalculator.java                 |
+----------------------------------------+------------------------------------------+
                                         | JDBC / Hibernate / Spring Data JPA
                                         v
+-----------------------------------------------------------------------------------+
|                    DATABASE TIER (MySQL 8.0 Relational DBMS)                      |
|   - Tables: users, categories, expenses, budget_limits                            |
|   - Foreign Keys with CASCADE DELETE, Indexed timestamps                          |
+-----------------------------------------------------------------------------------+`}
          </div>
        </div>

        {/* MySQL Database Schema */}
        <div className="transactions-card">
          <div className="card-title-main" style={{ marginBottom: '0.75rem' }}>
            🗄️ MySQL Database Schema (schema.sql)
          </div>
          <div className="code-block">
{`CREATE DATABASE IF NOT EXISTS spendwise_db;
USE spendwise_db;

-- 1. Users Table (Default monthly_budget = 0.00 for all new registrations)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    monthly_budget DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Expense Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color_code VARCHAR(20) NOT NULL,
    icon_name VARCHAR(50) NOT NULL
);

-- 3. Expenses Ledger Table
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method ENUM('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id)
);`}
          </div>
        </div>

        {/* Spring Boot Controller */}
        <div className="transactions-card">
          <div className="card-title-main" style={{ marginBottom: '0.75rem' }}>
            ☕ Spring Boot REST Controller (ExpenseController.java)
          </div>
          <div className="code-block">
{`package com.spendwise.controller;

import com.spendwise.entity.Expense;
import com.spendwise.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(@RequestParam Long userId) {
        return ResponseEntity.ok(expenseService.getExpensesByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        if (expense.getAmount() <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(expenseService.saveExpense(expense));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}`}
          </div>
        </div>

      </div>
    </div>
  );
}
