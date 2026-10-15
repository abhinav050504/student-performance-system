@echo off
echo ========================================================
echo   Auto Git Sync - Student Performance System
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/3] Staging modified files...
git add .

set /p commit_msg="Enter commit message (Press Enter for default daily timestamp): "
if "%commit_msg%"=="" (
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
    set commit_msg=Daily update: %date% %time%
)

echo [2/3] Committing changes...
git commit -m "%commit_msg%"

echo [3/3] Pushing to GitHub (origin/main)...
git push origin main

echo.
echo ========================================================
echo   Sync complete!
echo ========================================================
pause
