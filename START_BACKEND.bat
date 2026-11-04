@echo off
title SpendWise Spring Boot Backend
echo ===================================================
echo   Starting SpendWise Spring Boot Backend (:8080)
echo   Connected to MySQL expensetracker_db
echo ===================================================
echo.
cd /d "%~dp0backend\target"
java -jar expense-tracker-backend-1.0.0.jar
pause
