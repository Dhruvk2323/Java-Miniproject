@echo off
title Install SpendWise Dependencies
echo ===================================================
echo   Installing SpendWise Frontend Dependencies
echo ===================================================
echo.
cd /d "%~dp0"
echo Running npm install... Please wait 1-2 minutes.
echo.
call npm install
echo.
echo ===================================================
echo   Installation Complete!
echo   You can now run START_FRONTEND.bat
echo ===================================================
pause
