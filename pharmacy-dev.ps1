# PowerShell Script for Pharmacy App Development
# This script provides easy commands for common development tasks

# Colors for output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Blue = "Blue"

function Show-Header {
    param([string]$Title)
    Write-Host "`n🏥 $Title" -ForegroundColor $Blue
    Write-Host ("=" * 50) -ForegroundColor $Blue
}

function Test-TypeScript {
    Show-Header "TypeScript Compilation Check"
    
    Push-Location "mobile-app"
    
    Write-Host "Running TypeScript compilation check..." -ForegroundColor $Yellow
    
    $result = & npx tsc --noEmit 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript compilation successful - No errors found!" -ForegroundColor $Green
    } else {
        Write-Host "❌ TypeScript compilation failed:" -ForegroundColor $Red
        Write-Host $result -ForegroundColor $Red
    }
    
    Pop-Location
}

function Start-ReactNative {
    Show-Header "Starting React Native Metro Bundler"
    
    Push-Location "mobile-app"
    
    Write-Host "Starting Metro bundler..." -ForegroundColor $Yellow
    & npx react-native start
    
    Pop-Location
}

function Build-Android {
    Show-Header "Building Android App"
    
    Push-Location "mobile-app"
    
    Write-Host "Building Android application..." -ForegroundColor $Yellow
    & npx react-native run-android
    
    Pop-Location
}

function Build-iOS {
    Show-Header "Building iOS App"
    
    Push-Location "mobile-app"
    
    Write-Host "Building iOS application..." -ForegroundColor $Yellow
    & npx react-native run-ios
    
    Pop-Location
}

function Start-Backend {
    Show-Header "Starting Flask Backend"
    
    Push-Location "backend"
    
    Write-Host "Starting Flask server..." -ForegroundColor $Yellow
    & python app.py
    
    Pop-Location
}

function Install-Dependencies {
    Show-Header "Installing Dependencies"
    
    # Install React Native dependencies
    Write-Host "Installing React Native dependencies..." -ForegroundColor $Yellow
    Push-Location "mobile-app"
    & npm install
    Pop-Location
    
    # Install Python dependencies
    Write-Host "Installing Python dependencies..." -ForegroundColor $Yellow
    Push-Location "backend"
    & pip install -r requirements.txt
    Pop-Location
    
    Write-Host "✅ All dependencies installed!" -ForegroundColor $Green
}

function Show-Help {
    Show-Header "Pharmacy App Development Commands"
    
    Write-Host "Available commands:" -ForegroundColor $Yellow
    Write-Host "  Test-TypeScript     - Check TypeScript compilation" -ForegroundColor $Green
    Write-Host "  Start-ReactNative   - Start Metro bundler" -ForegroundColor $Green
    Write-Host "  Build-Android       - Build and run Android app" -ForegroundColor $Green
    Write-Host "  Build-iOS          - Build and run iOS app" -ForegroundColor $Green
    Write-Host "  Start-Backend       - Start Flask backend server" -ForegroundColor $Green
    Write-Host "  Install-Dependencies - Install all project dependencies" -ForegroundColor $Green
    Write-Host "  Show-Help          - Show this help message" -ForegroundColor $Green
    
    Write-Host "`nExamples:" -ForegroundColor $Yellow
    Write-Host "  Test-TypeScript" -ForegroundColor $Blue
    Write-Host "  Start-ReactNative" -ForegroundColor $Blue
    Write-Host "  Build-Android" -ForegroundColor $Blue
    
    Write-Host "`nNote: This script handles PowerShell syntax automatically!" -ForegroundColor $Green
    Write-Host "No need to use '&&' operators - just call the functions directly." -ForegroundColor $Green
}

# Show help by default
Show-Help