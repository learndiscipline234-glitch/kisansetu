@echo off
title KisanSetu - SIH26132 (Team Shakti) Launcher
echo ========================================================
echo   KisanSetu - AI Agricultural Price Discovery Platform
echo   Smart India Hackathon 2026 - Problem Statement SIH26132
echo   Team Shakti
echo ========================================================
echo.

echo [1/2] Starting Python FastAPI Backend on port 8000...
start cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Vite React Frontend on port 5173...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo KisanSetu is launching!
echo Backend API Docs:  http://127.0.0.1:8000/docs
echo Frontend Portal:   http://localhost:5173
echo ========================================================
pause
