# Troubleshooting script for Avika Backend API
Write-Host "🔧 Avika Backend API Troubleshooting" -ForegroundColor Cyan

# Step 1: Check directory and files
Write-Host "`n1️⃣ Checking Project Structure..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ Found package.json" -ForegroundColor Green
} else {
    Write-Host "❌ package.json not found! You're in the wrong directory." -ForegroundColor Red
    Write-Host "Navigate to: avika-backend-api-main\avika-backend-api-main" -ForegroundColor Yellow
    exit 1
}

# Step 2: Clean and rebuild
Write-Host "`n2️⃣ Cleaning and Rebuilding..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Cleaned dist folder" -ForegroundColor Green
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Building project..." -ForegroundColor Yellow
npm run build:prod

# Step 3: Check build output
if (Test-Path "dist/server.js") {
    Write-Host "✅ Build successful - dist/server.js created" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed - dist/server.js not found" -ForegroundColor Red
    Write-Host "Check build errors above" -ForegroundColor Yellow
    exit 1
}

# Step 4: Start server in background
Write-Host "`n3️⃣ Starting Server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "start" -PassThru -WindowStyle Hidden

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Step 5: Test endpoints
Write-Host "`n4️⃣ Testing Endpoints..." -ForegroundColor Yellow

$baseUrl = "http://localhost:3000"
$endpoints = @(
    @{ Path = "/"; Name = "Root" },
    @{ Path = "/health"; Name = "Health Check" },
    @{ Path = "/diagnostic/test"; Name = "Diagnostic Test" },
    @{ Path = "/diagnostic/endpoints"; Name = "Endpoint List" }
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$($endpoint.Path)" -TimeoutSec 5
        Write-Host "✅ $($endpoint.Name): SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "❌ $($endpoint.Name): FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 6: Test conversation API
Write-Host "`n5️⃣ Testing Conversation API..." -ForegroundColor Yellow
try {
    $body = "{`"text`": `"I feel anxious`"}"
    $response = Invoke-RestMethod -Uri "$baseUrl/api/conversation/emotion" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Conversation API: SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "❌ Conversation API: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Cleanup
Write-Host "`n6️⃣ Cleanup..." -ForegroundColor Yellow
if ($serverProcess -and !$serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force
    Write-Host "✅ Server process stopped" -ForegroundColor Green
}

Write-Host "`n🎉 Troubleshooting Complete!" -ForegroundColor Green
Write-Host "If all tests passed, start the server with: npm run dev:local" -ForegroundColor Yellow
Write-Host "Then test with: curl http://localhost:3000" -ForegroundColor Yellow