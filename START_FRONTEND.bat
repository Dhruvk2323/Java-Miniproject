@echo off
title SpendWise Frontend
echo ===================================================
echo   Starting SpendWise React Frontend (:5173)
echo ===================================================
echo.
cd /d "%~dp0"
call npm run dev
pause
