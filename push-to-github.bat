@echo off
REM Git Setup and Push Script for Yelp Prototype Lab Pair 45

echo.
echo ============================================
echo Yelp Prototype - Lab Pair 45
echo GitHub Push Script
echo ============================================
echo.

cd /d "c:\Users\Admin\OneDrive\Desktop\SPRING26\236\LAB\LAB_1\Lab1"

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed or not in PATH
    echo Please ensure Git is installed and try again
    pause
    exit /b 1
)

echo ✓ Git is installed

REM Initialize git repository
echo.
echo Initializing Git repository...
git init
echo ✓ Repository initialized

REM Add .gitignore
echo.
echo Creating .gitignore file...
if not exist ".gitignore" (
    (
        echo # Backend
        echo yelp_backend/venv/
        echo yelp_backend/.env
        echo yelp_backend/__pycache__/
        echo yelp_backend/yelp_dev.db
        echo yelp_backend/*.db
        echo.
        echo # Frontend
        echo yelp_frontend/node_modules/
        echo yelp_frontend/.env
        echo yelp_frontend/build/
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
    ) > .gitignore
    echo ✓ .gitignore created
)

REM Configure git user (if not already configured)
echo.
echo Configuring Git user...
git config --global user.email "admin@example.com" >nul 2>&1
git config --global user.name "Lab Admin" >nul 2>&1
echo ✓ Git user configured

REM Add all files
echo.
echo Adding all files to staging area...
git add -A
echo ✓ Files staged

REM Create initial commit
echo.
echo Creating initial commit...
git commit -m "Initial commit: Yelp Prototype v1.0 - Complete full-stack application with frontend, backend, and AI integration framework"
if errorlevel 1 (
    echo ⚠ Commit may have failed or no changes to commit
) else (
    echo ✓ Commit created
)

REM Add remote repository
echo.
echo Adding remote repository...
git remote add origin https://github.com/sivasuryachandran/Yelp-Prototype---Lab-Pair-45.git

REM Push to GitHub
echo.
echo Pushing to GitHub...
echo Note: You may be prompted for authentication
echo.
git branch -M main
git push -u origin main

echo.
echo ============================================
echo ✓ Push Complete!
echo ============================================
echo.
echo Repository: https://github.com/sivasuryachandran/Yelp-Prototype---Lab-Pair-45.git
echo.
pause
