# PowerShell script to create the heliopharm database
# Run this script if the database doesn't exist

Write-Host "Creating PostgreSQL database 'heliopharm'..." -ForegroundColor Green

# Database creation command
$createDbCommand = @"
& "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres -h localhost heliopharm
"@

try {
    Write-Host "Attempting to create database..." -ForegroundColor Yellow
    Invoke-Expression $createDbCommand
    Write-Host "Database 'heliopharm' created successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error creating database: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "This might be because:" -ForegroundColor Yellow
    Write-Host "1. Database already exists" -ForegroundColor Yellow
    Write-Host "2. PostgreSQL service is not running" -ForegroundColor Yellow
    Write-Host "3. Authentication failed" -ForegroundColor Yellow
}

# Test connection
Write-Host "`nTesting connection to heliopharm database..." -ForegroundColor Green

$testCommand = @"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d heliopharm -c "SELECT current_database();"
"@

try {
    Invoke-Expression $testCommand
    Write-Host "Connection test successful!" -ForegroundColor Green
}
catch {
    Write-Host "Connection test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nSetup complete! Your database credentials are:" -ForegroundColor Cyan
Write-Host "Database: heliopharm" -ForegroundColor White
Write-Host "User: postgres" -ForegroundColor White
Write-Host "Password: Ashrudi" -ForegroundColor White
Write-Host "Host: localhost" -ForegroundColor White
Write-Host "Port: 5432" -ForegroundColor White
