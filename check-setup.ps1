# PowerShell script to verify project setup
Write-Host "🔍 Checking Avika Project Setup..." -ForegroundColor Cyan

# Check if we're in the right directory
if (Test-Path "package.json") {
    Write-Host "✅ Found package.json" -ForegroundColor Green
    
    # Check key files
    $files = @(
        "src/server.ts",
        "src/controllers/chatGeminiAdvancedController.ts", 
        "src/routes/healthRoutes.ts",
        ".env"
    )
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Host "✅ Found $file" -ForegroundColor Green
        } else {
            Write-Host "❌ Missing $file" -ForegroundColor Red
        }
    }
    
    # Check environment variables
    Write-Host "`n🔧 Checking Environment Configuration..." -ForegroundColor Cyan
    if (Test-Path ".env") {
        $envContent = Get-Content ".env"
        $requiredVars = @("GEMINI_API_KEY", "SUPABASE_URL", "JWT_SECRET", "DB_ENCRYPTION_KEY")
        
        foreach ($var in $requiredVars) {
            if ($envContent -match "^$var=") {
                Write-Host "✅ $var configured" -ForegroundColor Green
            } else {
                Write-Host "❌ $var missing" -ForegroundColor Red
            }
        }
    }
    
    # Check if node_modules exists
    if (Test-Path "node_modules") {
        Write-Host "✅ Dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Dependencies not installed. Run: npm install" -ForegroundColor Yellow
    }
    
    Write-Host "`n🚀 Ready to start! Run: npm run dev:local" -ForegroundColor Green
    
} else {
    Write-Host "❌ package.json not found!" -ForegroundColor Red
    Write-Host "You're in the wrong directory. Navigate to:" -ForegroundColor Yellow
    Write-Host "cd 'avika-backend-api-main\avika-backend-api-main'" -ForegroundColor Yellow
}