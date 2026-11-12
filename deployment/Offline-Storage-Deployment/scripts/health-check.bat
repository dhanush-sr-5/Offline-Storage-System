@echo off
title Offline Storage Health Check

echo Checking Offline Storage System...
echo.

powershell -NoProfile -Command "try { $r = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -TimeoutSec 5; Write-Host 'Backend: Running'; Write-Host ('Database: ' + $r.database) } catch { Write-Host 'Application is not responding. Check start.bat.' }"

echo.
pause