-- ==============================================================
-- COMPLETE DATABASE SETUP: Expense Tracker Web Application
-- Run this single script in MySQL Workbench or CMD:
-- mysql -u root -p < setup.sql
-- ==============================================================

CREATE DATABASE IF NOT EXISTS expensetracker_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE expensetracker_db;

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) DEFAULT 'password123',
    full_name VARCHAR(100),
    monthly_budget DECIMAL(12, 2) DEFAULT 25000.00 CHECK (monthly_budget >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Categories Table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    budget_limit DECIMAL(12, 2) DEFAULT 5000.00 CHECK (budget_limit >= 0),
    color VARCHAR(20) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'Folder'
) ENGINE=InnoDB;

-- 3. Expenses Table
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

    CONSTRAINT fk_expenses_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,

    CONSTRAINT fk_expenses_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_title ON expenses(title);

-- 4. Initial Seed Data
INSERT INTO users (username, email, password, full_name, monthly_budget) VALUES
('demo_user', 'karan@example.com', 'password123', 'Karan Student', 30000.00);

INSERT INTO categories (name, budget_limit, color, icon) VALUES
('Food & Dining', 6000.00, '#F59E0B', 'Utensils'),
('Transportation', 3500.00, '#3B82F6', 'Car'),
('Shopping', 5000.00, '#EC4899', 'ShoppingBag'),
('Bills & Utilities', 4000.00, '#8B5CF6', 'FileText'),
('Entertainment', 3000.00, '#10B981', 'Film'),
('Health & Fitness', 2500.00, '#EF4444', 'HeartPulse'),
('Education', 4000.00, '#06B6D4', 'GraduationCap'),
('Miscellaneous', 2000.00, '#6B7280', 'Folder');

INSERT INTO expenses (title, amount, category_id, user_id, expense_date, payment_method, notes) VALUES
('Grocery Shopping at DMart', 2450.00, 1, 1, CURRENT_DATE - INTERVAL 1 DAY, 'UPI', 'Monthly groceries, pulses, and snacks'),
('Petrol Fill-up for Two-Wheeler', 1200.00, 2, 1, CURRENT_DATE - INTERVAL 2 DAY, 'Credit Card', 'Indian Oil fuel station fill'),
('Electricity Bill (Mahavitaran)', 1850.00, 4, 1, CURRENT_DATE - INTERVAL 4 DAY, 'Net Banking', 'Monthly electricity bill payment'),
('Cinema Tickets (IMAX Weekend)', 750.00, 5, 1, CURRENT_DATE - INTERVAL 5 DAY, 'UPI', 'Movie night with college classmates'),
('Java Full Stack Laboratory Textbook', 1400.00, 7, 1, CURRENT_DATE - INTERVAL 7 DAY, 'Debit Card', 'Reference books for Semester III exams'),
('Dinner with Study Group', 1820.00, 1, 1, CURRENT_DATE - INTERVAL 9 DAY, 'UPI', 'Post-lab celebratory dinner'),
('Cult.fit Gym Monthly Subscription', 1500.00, 6, 1, CURRENT_DATE - INTERVAL 12 DAY, 'UPI', 'Fitness renewal fee'),
('Boat Rockerz Wireless Earbuds', 2299.00, 3, 1, CURRENT_DATE - INTERVAL 15 DAY, 'Credit Card', 'Amazon festive discount purchase'),
('Broadband Wi-Fi Plan Recharge', 899.00, 4, 1, CURRENT_DATE - INTERVAL 18 DAY, 'UPI', 'Monthly unlimited high-speed fiber internet'),
('Metro Commute Smart Card Recharge', 500.00, 2, 1, CURRENT_DATE - INTERVAL 21 DAY, 'Cash', 'Local transit pass top-up');
