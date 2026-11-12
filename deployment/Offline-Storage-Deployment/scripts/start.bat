
@echo off
title Offline Storage System

echo ==========================================
echo       OFFLINE STORAGE SYSTEM
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed.
    echo Install Node.js before starting the application.
    pause
    exit /b 1
)

echo Checking MongoDB service...

sc query MongoDB | findstr /I "RUNNING" >nul
if errorlevel 1 (
    echo MongoDB is not running.
    echo Attempting to start MongoDB service...
    net start MongoDB
)

echo.
echo Starting Offline Storage System...
cd /d "%~dp0..\application\backend"

node server.js

echo.
echo Offline Storage System stopped.
pause
