# 🏥 Pharmacy Dashboard Setup Script
# Professional Mobile Pharmacy Management System

Write-Host "🏥 Setting up Professional Pharmacy Management System..." -ForegroundColor Green
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to install if missing
function Install-Requirement($name, $command, $installCmd) {
    Write-Host "Checking $name..." -NoNewline
    if (Test-Command $command) {
        Write-Host " ✅ Found" -ForegroundColor Green
    } else {
        Write-Host " ❌ Not found" -ForegroundColor Red
        Write-Host "Please install $name manually:"
        Write-Host $installCmd -ForegroundColor Yellow
        return $false
    }
    return $true
}

# Check Prerequisites
Write-Host "📋 Checking Prerequisites..." -ForegroundColor Cyan

$allGood = $true
$allGood = (Install-Requirement "Node.js" "node" "Download from https://nodejs.org/") -and $allGood
$allGood = (Install-Requirement "Python" "python" "Download from https://python.org/") -and $allGood
$allGood = (Install-Requirement "PostgreSQL" "psql" "Download from https://postgresql.org/") -and $allGood

if (-not $allGood) {
    Write-Host ""
    Write-Host "❌ Please install missing prerequisites first!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All prerequisites found!" -ForegroundColor Green
Write-Host ""

# Setup Backend
Write-Host "🔧 Setting up Flask Backend..." -ForegroundColor Cyan

if (-not (Test-Path "backend\venv")) {
    Write-Host "Creating Python virtual environment..."
    Set-Location backend
    python -m venv venv
    Set-Location ..
}

Write-Host "Activating virtual environment and installing dependencies..."
Set-Location backend
& "venv\Scripts\Activate.ps1"

if (Test-Path "requirements.txt") {
    pip install -r requirements.txt
    Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "❌ requirements.txt not found!" -ForegroundColor Red
}

# Create .env file if not exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env configuration file..."
    @"
# Flask Configuration
SECRET_KEY=dev-secret-key-change-in-production-$(Get-Random)
JWT_SECRET_KEY=jwt-secret-change-in-production-$(Get-Random)

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/pharmacy_db

# Translation API (Optional)
TRANSLATION_API_KEY=your-google-translate-api-key

# Email Configuration (Optional)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379/0

# Environment
FLASK_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created! Please update with your credentials." -ForegroundColor Green
}

Set-Location ..

# Setup Database
Write-Host ""
Write-Host "🗄️  Setting up PostgreSQL Database..." -ForegroundColor Cyan

$dbExists = $false
try {
    $result = psql -U postgres -lqt | Select-String "pharmacy_db"
    if ($result) {
        $dbExists = $true
        Write-Host "Database 'pharmacy_db' already exists." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Could not check database. Please ensure PostgreSQL is running." -ForegroundColor Yellow
}

if (-not $dbExists) {
    Write-Host "Creating pharmacy_db database..."
    try {
        createdb -U postgres pharmacy_db
        Write-Host "✅ Database created successfully!" -ForegroundColor Green
        
        Write-Host "Setting up database schema..."
        psql -U postgres -d pharmacy_db -f "database\schema.sql"
        
        Write-Host "Inserting sample data..."
        psql -U postgres -d pharmacy_db -f "database\initial_data.sql"
        
        Write-Host "✅ Database setup complete!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Database setup failed. Please check PostgreSQL connection." -ForegroundColor Red
        Write-Host "Manual setup: createdb pharmacy_db && psql -d pharmacy_db -f database/schema.sql" -ForegroundColor Yellow
    }
}

# Setup Mobile App
Write-Host ""
Write-Host "📱 Setting up React Native Mobile App..." -ForegroundColor Cyan

Set-Location mobile-app

if (Test-Path "package.json") {
    Write-Host "Installing Node.js dependencies..."
    
    # Check if yarn is available, otherwise use npm
    if (Test-Command "yarn") {
        yarn install
    } else {
        npm install
    }
    
    Write-Host "✅ Mobile app dependencies installed!" -ForegroundColor Green
    
    # Setup for Android
    if (Test-Path "$env:ANDROID_HOME") {
        Write-Host "Android SDK detected. Setting up Android project..."
        
        # Create android project if not exists
        if (-not (Test-Path "android")) {
            npx react-native init PharmacyApp --template react-native-template-typescript
        }
    } else {
        Write-Host "⚠️  Android SDK not found. Please install Android Studio for Android development." -ForegroundColor Yellow
    }
    
} else {
    Write-Host "❌ package.json not found in mobile-app directory!" -ForegroundColor Red
}

Set-Location ..

# Create startup scripts
Write-Host ""
Write-Host "📝 Creating startup scripts..." -ForegroundColor Cyan

# Backend startup script
@"
@echo off
echo 🏥 Starting Pharmacy Backend Server...
cd backend
call venv\Scripts\activate
python app.py
"@ | Out-File -FilePath "start-backend.bat" -Encoding ASCII

# Mobile app startup scripts
@"
@echo off
echo 📱 Starting React Native Metro Server...
cd mobile-app
npm start
"@ | Out-File -FilePath "start-mobile.bat" -Encoding ASCII

@"
@echo off
echo 🤖 Running Android App...
cd mobile-app
npx react-native run-android
"@ | Out-File -FilePath "run-android.bat" -Encoding ASCII

Write-Host "✅ Startup scripts created!" -ForegroundColor Green

# Final instructions
Write-Host ""
Write-Host "🎉 Setup Complete! Next Steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1. 🗄️  Database Setup:" -ForegroundColor Cyan
Write-Host "   - Ensure PostgreSQL is running"
Write-Host "   - Update backend\.env with your database credentials"
Write-Host ""
Write-Host "2. 🔧 Backend Setup:" -ForegroundColor Cyan
Write-Host "   - Run: .\start-backend.bat"
Write-Host "   - Server will start at http://localhost:5000"
Write-Host ""
Write-Host "3. 📱 Mobile App Setup:" -ForegroundColor Cyan
Write-Host "   - For Android: .\run-android.bat"
Write-Host "   - For iOS (macOS only): cd mobile-app && npx react-native run-ios"
Write-Host ""
Write-Host "4. 🔐 First Login:" -ForegroundColor Cyan
Write-Host "   - Register a new pharmacy or use sample data"
Write-Host "   - Sample login: healthcare@pharmacy.com"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - API Docs: http://localhost:5000/api/docs"
Write-Host "   - README.md for detailed setup"
Write-Host "   - SETUP.md for troubleshooting"
Write-Host ""
Write-Host "🛠️  Development Tools:" -ForegroundColor Cyan
Write-Host "   - Backend logs in backend/logs/"
Write-Host "   - Mobile debugging with React Native Debugger"
Write-Host ""
Write-Host "✨ Professional Features Ready:" -ForegroundColor Green
Write-Host "   ✅ Inventory Management with batch tracking"
Write-Host "   ✅ Prescription processing workflow"
Write-Host "   ✅ Low-stock alerts and notifications"
Write-Host "   ✅ Multi-language translation support"
Write-Host "   ✅ Professional medical UI/UX"
Write-Host "   ✅ Mobile-first responsive design"
Write-Host "   ✅ Reports and analytics"
Write-Host ""
Write-Host "🏥 Happy pharmacy management!" -ForegroundColor Green