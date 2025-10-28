# Quick API Test Script
Write-Host "🚀 Starting Avika Backend API Test..." -ForegroundColor Green

# Start the server in background
Write-Host "Starting server..." -ForegroundColor Yellow
$serverProcess = Start-Process -NoNewWindow -FilePath "node" -ArgumentList "dist/server.js" -PassThru

# Wait for server to start
Start-Sleep 3

try {
    # Test root endpoint
    Write-Host "Testing root endpoint..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:3000/" -Method GET
    
    if ($response.success) {
        Write-Host "✅ Root endpoint working!" -ForegroundColor Green
        Write-Host "API Version: $($response.data.version)" -ForegroundColor Cyan
        Write-Host "Available endpoints:" -ForegroundColor Cyan
        $response.data.endpoints | Format-Table -AutoSize
    } else {
        Write-Host "❌ Root endpoint failed" -ForegroundColor Red
    }

    # Test health endpoint
    Write-Host "Testing health endpoint..." -ForegroundColor Yellow
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    
    if ($healthResponse.status -eq "healthy") {
        Write-Host "✅ Health endpoint working!" -ForegroundColor Green
    } else {
        Write-Host "❌ Health endpoint failed" -ForegroundColor Red
    }

} catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Stop the server
    Write-Host "Stopping server..." -ForegroundColor Yellow
    Stop-Process -Id $serverProcess.Id -Force
    Write-Host "✅ Test completed!" -ForegroundColor Green
}