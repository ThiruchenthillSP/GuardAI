@echo off
TITLE GuardAI - System Startup
echo ====================================================
echo      GUARDAI - SYSTEM STARTUP (CLEAN VERSION)
echo ====================================================

:: 1. Force directory
cd /d "%~dp0"

:: 2. Detect Python
set PYTHON_CMD=python
where py >nul 2>nul
if %errorlevel% == 0 set PYTHON_CMD=py
echo [+] Using Python: %PYTHON_CMD%

:: 3. Check Folders
if not exist "backend" (
    echo [!] ERROR: backend folder missing!
    pause
    exit /b
)
if not exist "frontend" (
    echo [!] ERROR: frontend folder missing!
    pause
    exit /b
)

:: 4. Sync Backend Libraries
echo [1/3] Checking Backend Libraries (XGBoost, GNN, Torch)...
"%PYTHON_CMD%" -m pip install xgboost shap scikit-learn pandas fastapi uvicorn pydantic torch torch-geometric --index-url https://download.pytorch.org/whl/cpu

:: 5. Sync Frontend Dependencies
echo [2/3] Checking Frontend Dependencies...
if not exist "frontend\node_modules" (
    echo [!] node_modules missing. Installing...
    cd frontend && call npm install && cd ..
)

:: 6. Launch Services
echo [3/3] Launching Backend and Frontend...

:: Start Backend
start "GuardAI - Backend" /D "%~dp0backend" cmd /k "%PYTHON_CMD% main.py"

:: Start Frontend
start "GuardAI - Frontend" /D "%~dp0frontend" cmd /k "npm run dev"

echo.
echo ====================================================
echo      STARTUP COMPLETE
echo ====================================================
pause
