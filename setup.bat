@echo off
echo ===================================================
echo GuardAI Environment Setup Script
echo ===================================================
echo.

echo [1/2] Installing Backend Dependencies (Python)
echo ---------------------------------------------------
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install Python dependencies. Ensure Python is installed.
    exit /b %errorlevel%
)
cd ..
echo.

echo [2/2] Installing Frontend Dependencies (Node.js)
echo ---------------------------------------------------
cd frontend
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install Node dependencies. Ensure Node.js and NPM are installed.
    exit /b %errorlevel%
)
cd ..
echo.

echo ===================================================
echo Setup Complete!
echo You can now start the application:
echo.
echo Terminal 1 (Backend): 
echo    cd backend
echo    uvicorn main:app --reload
echo.
echo Terminal 2 (Frontend): 
echo    cd frontend
echo    npm run dev
echo ===================================================
pause
