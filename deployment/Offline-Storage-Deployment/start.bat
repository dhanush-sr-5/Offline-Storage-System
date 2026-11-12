@echo off
title Offline Storage System

echo =====================================
echo       OFFLINE STORAGE SYSTEM
echo =====================================

cd /d "%~dp0application\backend"

echo Starting Offline Storage System...
echo.

node server.js

echo.
echo Server stopped.
pause