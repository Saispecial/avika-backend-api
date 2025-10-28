@echo off
echo 🚀 Starting Avika Backend API Server...

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found! Make sure you're in the project directory.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Build the project
echo 🔨 Building project...
call npx tsup src/server.ts --format esm --target es2022 --outDir dist --sourcemap
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM Start the server
echo 🌟 Starting server on port 3000...
echo 📋 Available endpoints:
echo   - http://localhost:3000 (Root)
echo   - http://localhost:3000/health (Health Check)
echo   - http://localhost:3000/diagnostic/endpoints (All Endpoints)
echo.
echo Press Ctrl+C to stop the server
node dist/server.js