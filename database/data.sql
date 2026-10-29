-- ==============================================================
-- SAMPLE SEED DATA: Expense Tracker Web Application
-- Pre-loaded realistic records for demonstration and viva testing
-- ==============================================================

USE expensetracker_db;

-- 1. Insert Sample User
INSERT INTO users (username, email, full_name, monthly_budget)
VALUES ('demo_user', 'karan@example.com', 'Karan Student', 30000.00)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 2. Insert Standard Expense Categories
INSERT INTO categories (name, budget_limit, color, icon) VALUES
('Food & Dining', 6000.00, '#F59E0B', 'Utensils'),
('Transportation', 3500.00, '#3B82F6', 'Car'),
('Shopping', 5000.00, '#EC4899', 'ShoppingBag'),
('Bills & Utilities', 4000.00, '#8B5CF6', 'FileText'),
('Entertainment', 3000.00, '#10B981', 'Film'),
('Health & Fitness', 2500.00, '#EF4444', 'HeartPulse'),
('Education', 4000.00, '#06B6D4', 'GraduationCap'),
('Miscellaneous', 2000.00, '#6B7280', 'Folder')
ON DUPLICATE KEY UPDATE budget_limit = VALUES(budget_limit);

-- 3. Insert Realistic Sample Expenses
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
