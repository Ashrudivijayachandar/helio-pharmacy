# ✅ CORRECT PowerShell Commands for Pharmacy App

## The Problem:
# ❌ WRONG (Bash syntax - doesn't work in PowerShell):
# cd .. && cd .. && npx tsc --noEmit

## ✅ CORRECT PowerShell Solutions:

### Method 1: Multiple separate commands
cd mobile-app
npx tsc --noEmit

### Method 2: Using semicolons as separators
cd mobile-app; npx tsc --noEmit

### Method 3: Using PowerShell's line continuation
cd mobile-app `
npx tsc --noEmit

### Method 4: Using Push-Location/Pop-Location (recommended)
Push-Location mobile-app
npx tsc --noEmit
Pop-Location

## 🚀 Common Development Commands:

### TypeScript Check:
cd mobile-app
npx tsc --noEmit

### Start React Native:
cd mobile-app
npx react-native start

### Build Android:
cd mobile-app
npx react-native run-android

### Build iOS:
cd mobile-app
npx react-native run-ios

### Start Backend:
cd backend
python app.py

### Install Dependencies:
cd mobile-app
npm install
cd ../backend
pip install -r requirements.txt
cd ..

## 💡 Pro Tips:

1. Use semicolons (;) instead of && in PowerShell
2. Use Push-Location/Pop-Location for directory navigation
3. Use the pharmacy-dev.ps1 script for automated commands
4. Import the script with: . .\pharmacy-dev.ps1

## 📱 Quick Start:
1. cd c:\pharmacy
2. . .\pharmacy-dev.ps1
3. Test-TypeScript