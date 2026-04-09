@echo off
TITLE Fraud Detection Full-Stack Starter
echo ====================================================
echo      Starting Full-Stack Fraud Detection System...
echo ====================================================

cd /d "%~dp0"

:: Detect Python
set PYTHON_CMD=py
where %PYTHON_CMD% >nul 2>nul
if %errorlevel% neq 0 (
    set PYTHON_CMD=python
)

:: 1. Start Backend in a new window
echo [1/2] Starting FastAPI Backend on http://localhost:8000
start "Backend - FastAPI" cmd /k "cd backend && %PYTHON_CMD% main.py"

:: 2. Start Frontend
echo [2/2] Starting React Frontend on http://localhost:5173
start "Frontend - React" cmd /k "cd frontend && npm run dev"

echo ====================================================
echo      Both services are starting!
echo      Backend: http://localhost:8000
echo      Frontend: http://localhost:5173
echo ====================================================
pause
