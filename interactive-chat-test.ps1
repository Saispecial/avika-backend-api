# Interactive Chat Test for Avika Backend API
# This script lets you chat with the bot and see how it responds

Write-Host "🌟 Avika Interactive Chat Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$API_URL = "http://localhost:3000"
$JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwic2Vzc2lvbklkIjoidGVzdC1zZXNzaW9uLTEyMyIsImlhdCI6MTc2MjYwOTMyMCwiZXhwIjoxNzYyNjk1NzIwfQ.COXEEKVtAMpvoFNukf8py1H8QhJ2UwYhcQhWu2l64lI"
$SESSION_ID = "test-session-$(Get-Date -Format 'yyyyMMddHHmmss')"
$conversationHistory = @()

# Check if server is running
Write-Host "🔍 Checking if server is running..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "$API_URL/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host "   Status: $($healthCheck.data.status)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Server is not running!" -ForegroundColor Red
    Write-Host "   Please start the server first with: npm start" -ForegroundColor Yellow
    Write-Host ""
    exit
}

Write-Host "💬 Chat Instructions:" -ForegroundColor Cyan
Write-Host "   - Type your message and press Enter" -ForegroundColor Gray
Write-Host "   - Type 'exit' or 'quit' to end the chat" -ForegroundColor Gray
Write-Host "   - Type 'clear' to clear conversation history" -ForegroundColor Gray
Write-Host "   - Try different emotions: anxious, sad, angry, happy" -ForegroundColor Gray
Write-Host ""
Write-Host "🤖 Avika: Hello! I'm Avika, and I'm here to listen and support you. How are you feeling today?" -ForegroundColor Green
Write-Host ""

$exchangeCount = 0

while ($true) {
    # Get user input
    Write-Host "You: " -NoNewline -ForegroundColor Cyan
    $userMessage = Read-Host
    
    # Check for exit commands
    if ($userMessage -eq "exit" -or $userMessage -eq "quit") {
        Write-Host ""
        Write-Host "👋 Thank you for chatting with Avika. Take care!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Chat Statistics:" -ForegroundColor Cyan
        Write-Host "   Total exchanges: $exchangeCount" -ForegroundColor Gray
        Write-Host "   Session ID: $SESSION_ID" -ForegroundColor Gray
        break
    }
    
    # Check for clear command
    if ($userMessage -eq "clear") {
        $conversationHistory = @()
        $exchangeCount = 0
        Write-Host ""
        Write-Host "🔄 Conversation history cleared!" -ForegroundColor Yellow
        Write-Host ""
        continue
    }
    
    # Skip empty messages
    if ([string]::IsNullOrWhiteSpace($userMessage)) {
        continue
    }
    
    $exchangeCount++
    
    # Prepare request body
    $body = @{
        message = $userMessage
        sessionId = $SESSION_ID
        conversationHistory = $conversationHistory
    } | ConvertTo-Json
    
    # Send message to API
    try {
        Write-Host ""
        Write-Host "🤔 Avika is thinking..." -ForegroundColor Gray
        
        $response = Invoke-RestMethod -Uri "$API_URL/api/chat-gemini-advanced" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $JWT_TOKEN"
                "Content-Type" = "application/json"
            } `
            -Body $body `
            -ErrorAction Stop
        
        Write-Host ""
        
        if ($response.success) {
            $data = $response.data
            
            # Display bot response
            Write-Host "🤖 Avika: " -NoNewline -ForegroundColor Green
            Write-Host $data.response -ForegroundColor White
            
            # Display emotion and risk level
            Write-Host ""
            Write-Host "   📊 Analysis:" -ForegroundColor DarkGray
            Write-Host "      Emotion: $($data.emotion)" -ForegroundColor DarkGray
            
            # Color code risk level
            $riskColor = switch ($data.riskLevel) {
                "high" { "Red" }
                "medium" { "Yellow" }
                default { "Green" }
            }
            Write-Host "      Risk Level: " -NoNewline -ForegroundColor DarkGray
            Write-Host $data.riskLevel -ForegroundColor $riskColor
            Write-Host "      Stage: $($data.stage)" -ForegroundColor DarkGray
            Write-Host "      Exchange #: $($data.exchangeCount)" -ForegroundColor DarkGray
            
            # Display recommendations if available
            if ($data.recommendations -and $data.recommendations.Count -gt 0) {
                Write-Host ""
                Write-Host "   💡 Recommendations:" -ForegroundColor Cyan
                foreach ($rec in $data.recommendations) {
                    Write-Host "      $rec" -ForegroundColor Gray
                }
            }
            
            # Update conversation history
            $conversationHistory += $userMessage
            $conversationHistory += $data.response
            
            # Keep only last 10 messages
            if ($conversationHistory.Count -gt 10) {
                $conversationHistory = $conversationHistory[-10..-1]
            }
            
        } else {
            Write-Host "❌ Error: $($response.error)" -ForegroundColor Red
        }
        
    } catch {
        Write-Host ""
        Write-Host "❌ Failed to send message: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "   Status Code: $statusCode" -ForegroundColor Yellow
            
            if ($statusCode -eq 401) {
                Write-Host "   💡 Tip: JWT token might be expired. Check DEPLOYMENT_CHECKLIST.md for a new token." -ForegroundColor Yellow
            }
        }
    }
    
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")