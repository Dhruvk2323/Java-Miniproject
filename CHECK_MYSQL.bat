@echo off
title SpendWise MySQL Database Checker
echo ===================================================
echo   SPENDWISE - LIVE MYSQL DATABASE INSPECTOR
echo ===================================================
echo.
echo Database: expensetracker_db
echo.
"C:\Program Files\MySQL\MySQL Server 26.7\bin\mysql.exe" -u root -pmysql@442 expensetracker_db -t -e "SELECT id, username, email, full_name, monthly_budget FROM users; SELECT id, title, amount, payment_method, expense_date FROM expenses;"
echo.
echo ===================================================
echo Press any key to exit...
pause >nul
