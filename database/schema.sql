-- ==============================================================
-- DATABASE SCHEMA: Expense Tracker Web Application
-- Course: Full Stack Java Laboratory (CE-JWP-LAB)
-- Scheme: DB25-V1 | Academic Year 2026-27
-- Database Management System: MySQL 8.x / 26.x
-- ==============================================================

-- 1. Create Database if not already present
CREATE DATABASE IF NOT EXISTS expensetracker_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE expensetracker_db;

-- 2. Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- 3. Users Table (Core Entity)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    monthly_budget DECIMAL(12, 2) DEFAULT 25000.00 CHECK (monthly_budget >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Categories Table (Lookup & Budget Target Entity)
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    budget_limit DECIMAL(12, 2) DEFAULT 5000.00 CHECK (budget_limit >= 0),
    color VARCHAR(20) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'Folder'
) ENGINE=InnoDB;

-- 5. Expenses Table (Transaction / Ledger Entity)
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    category_id BIGINT NOT NULL,
    user_id BIGINT,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraints
    CONSTRAINT fk_expenses_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,

    CONSTRAINT fk_expenses_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Indexes for Query Performance & Analytical Filtering
CREATE INDEX idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_title ON expenses(title);
