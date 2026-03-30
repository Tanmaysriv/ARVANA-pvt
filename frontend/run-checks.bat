@echo off
echo ===== RUNNING ESLINT =====
call npm run lint
echo.
echo ===== RUNNING BUILD =====
call npm run build
echo.
echo ===== CHECKS COMPLETE =====
