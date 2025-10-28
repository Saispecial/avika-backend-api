# Setup Remote Repository Script
# Run this AFTER creating the GitHub repository

Write-Host "🚀 Setting up remote repository..." -ForegroundColor Green

# Add the remote repository (replace YOUR_USERNAME with your actual GitHub username)
$username = Read-Host "Enter your GitHub username"
$repoUrl = "https://github.com/$username/avika-backend-api.git"

Write-Host "Adding remote repository: $repoUrl" -ForegroundColor Yellow
git remote add origin $repoUrl

# Rename branch to main (GitHub's default)
Write-Host "Renaming branch to main..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ Repository setup complete!" -ForegroundColor Green
Write-Host "Your repository is now available at: $repoUrl" -ForegroundColor Cyan