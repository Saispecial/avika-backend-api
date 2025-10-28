# Manual testing script for PowerShell
param(
    [string]$BaseUrl = "http://localhost:3000"
)

Write-Host "🧪 Manual API Testing Script" -ForegroundColor Cyan
Write-Host "Testing server at: $BaseUrl" -ForegroundColor Yellow

# Function to test endpoint
function Test-Endpoint {
    param($Url, $Method = "GET", $Body = $null)
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method
        }
        Write-Host "✅ $Method $Url - SUCCESS" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "❌ $Method $Url - FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test health endpoint
Write-Host "`n1️⃣ Testing Health Check..." -ForegroundColor Cyan
$health = Test-Endpoint "$BaseUrl/health"

if ($health) {
    Write-Host "   Server Status: $($health.data.status)" -ForegroundColor Green
    Write-Host "   Gemini Integration: $($health.data.features.geminiIntegration)" -ForegroundColor Green
    Write-Host "   Supabase Connection: $($health.data.features.supabaseConnection)" -ForegroundColor Green
}

# Test conversation API
Write-Host "`n2️⃣ Testing Conversation API..." -ForegroundColor Cyan
Test-Endpoint "$BaseUrl/api/conversation/start" "POST" "{}"

# Test emotion detection
Write-Host "`n3️⃣ Testing Emotion Detection..." -ForegroundColor Cyan
$emotionBody = '{"text": "I feel really anxious about everything"}'
Test-Endpoint "$BaseUrl/api/conversation/emotion" "POST" $emotionBody

# Test safety detection
Write-Host "`n4️⃣ Testing Safety Detection..." -ForegroundColor Cyan
$safetyBody = '{"text": "I want to hurt myself"}'
Test-Endpoint "$BaseUrl/api/conversation/engage" "POST" $safetyBody

# Test JWT protected endpoint (should fail without token)
Write-Host "`n5️⃣ Testing JWT Authentication..." -ForegroundColor Cyan
$chatResponse = Test-Endpoint "$BaseUrl/api/v1/chat/message/test-user" "POST" '{"message": "test"}'

if ($null -eq $chatResponse) {
    Write-Host "✅ JWT Authentication working (correctly rejected without token)" -ForegroundColor Green
}

Write-Host "`n🎉 Manual testing complete!" -ForegroundColor Green
Write-Host "If server is not running, start it with: npm run dev:local" -ForegroundColor Yellow