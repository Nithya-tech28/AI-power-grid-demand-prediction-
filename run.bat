@echo off
cd /d "%~dp0"

start "Backend" cmd /k python backend\app.py

timeout /t 3 /nobreak >nul

start "" "%~dp0frontend\index.html"