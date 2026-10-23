@echo off
echo ========================================================
echo   Starting AidLink: Flask (Backend) + Next.js (Frontend)
echo ========================================================

start "AidLink - Backend (Flask :5000)" cmd /k "cd backend && python app.py"
start "AidLink - Frontend (Next.js :3000)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers launched in separate windows!
echo - Backend API:  http://localhost:5000/api/health
echo - Frontend UI:  http://localhost:3000
echo.
pause
