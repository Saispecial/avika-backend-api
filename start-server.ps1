# Simple server startup script
Write-Host "🚀 Starting Avika Backend API Server..." -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found! Make sure you're in the project directory." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Try to build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npx tsup src/server.ts --format esm --target es2022 --outDir dist --sourcemap

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Start the server
Write-Host "🌟 Starting server on port 3000..." -ForegroundColor Green
node dist/server.js