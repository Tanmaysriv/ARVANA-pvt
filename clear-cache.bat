@echo off
echo Clearing Vite cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo Cache cleared successfully!
) else (
    echo No cache found.
)
echo.
echo Starting dev server...
npm run dev
