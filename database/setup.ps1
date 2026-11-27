<# 
  database\setup.ps1 - Roxiler Systems Database Setup Script
  Reads backend\.env, creates the database if missing, runs schema and seed SQL.
  Safe to run repeatedly (idempotent).
  
  Prerequisites:
  - PostgreSQL must be installed and running
  - psql must be on PATH, OR edit the PSQL_PATH variable below
  - Node.js/npm not required for this script (uses psql directly)
#>

# PowerShell Database Setup Script for Roxiler Systems

# Read configuration from backend\.env
$env:PSQL_SERVER = "127.0.0.1"
$env:PSQL_PORT = "5432"
$env:PSQL_USER = "postgres"
$env:PSQL_PASSWORD = "postgres"

# Read database name from .env (backend folder)
$backendEnvPath = "D:\Job Stuff\Roxiler_Systems_assignment\backend\.env"
$dbName = ""

if (Test-Path $backendEnvPath) {
    $envContent = Get-Content $backendEnvPath -Raw
    $dbNameMatch = $envContent -match "DB_DATABASE=(\S+)"
    if ($dbNameMatch) {
        $dbName = $matches[1]
    }
}

if (-not $dbName) {
    Write-Error "Could not determine DB_DATABASE from backend\.env"
    exit 1
}

$psql = "psql"
$psqlConnStr = "host=$env:PSQL_SERVER port=$env:PSQL_PORT user=$env:PSQL_PASSWORD dbname=$dbName"

Write-Host "=== Roxiler Systems Database Setup ===" -ForegroundColor Cyan
Write-Host "Database: $dbName" -ForegroundColor Yellow
Write-Host "Server: $env:PSQL_SERVER:$env:PSQL_PORT" -ForegroundColor Yellow
Write-Host ""

# Step 1: Create database if it doesn't exist
Write-Host "Step 1: Ensuring database '$dbName' exists..." -ForegroundColor White
$checkDb = & $psql -h $env:PSQL_SERVER -p $env:PSQL_PORT -U $env:PSQL_USER -tc "SELECT 1 FROM pg_database WHERE datname = N'$dbName'"
if ($checkDb -notcontains "1") {
    Write-Host "Database does not exist. Creating..." -ForegroundColor Yellow
    & $psql -h $env:PSQL_SERVER -p $env:PSQL_PORT -U $env:PSQL_USER -c "CREATE DATABASE [$dbName]"
    Write-Host "Database created successfully." -ForegroundColor Green
} else {
    Write-Host "Database already exists. Skipping creation." -ForegroundColor Green
}

# Step 2: Run schema.sql
Write-Host "Step 2: Running schema.sql..." -ForegroundColor White
$schemaPath = "D:\Job Stuff\Roxiler_Systems_assignment\database\02_schema.sql"
if (Test-Path $schemaPath) {
    $schemaResult = & $psql -h $env:PSQL_SERVER -p $env:PSQL_PORT -U $env:PSQL_USER -f $schemaPath $dbName
    Write-Host "Schema applied successfully." -ForegroundColor Green
    Write-Host "$schemaResult" -ForegroundColor Caret
} else {
    Write-Error "Schema file not found: $schemaPath"
    exit 1
}

# Step 3: Run seed.sql
Write-Host "Step 3: Running seed.sql..." -ForegroundColor Write-Host
$seedPath = "D:\Job Stuff\Roxiler_Systems_assignment\database\03_seed.sql"
if (Test-Path $seedPath) {
    $seedResult = & $psql -h $env:PSQL_SERVER -p $env:PSQL_PORT -U $env:PSQL_USER -f $seedPath $dbName
    Write-Host "Seed data applied successfully." -ForegroundColor Green
    Write-Host "$seedResult" -ForegroundColor Caret
} else {
    Write-Error "Seed file not found: $seedPath"
    exit 1
}

Write-Host ""
Write-Host "=== Database Setup Complete ===" -ForegroundColor Cyan
Write-Host "The following demo credentials can now be used:" -ForegroundColor Yellow
Write-Host "  Admin:      admin@roxiler.com / AdminPass123!" -ForegroundColor White
Write-Host "  Owner 1:    priya.ramanathan@roxiler.com / OwnerPass123!" -ForegroundColor White
Write-Host "  Owner 2:    rohan.kulkarni@roxiler.com / OwnerPass123!" -ForegroundColor White
Write-Host "  User 1:     ananya.bhattacharya@roxiler.com / UserPass123!" -ForegroundColor White
Write-Host "  User 2:     vikram.chauhan@roxiler.com / UserPass123!" -ForegroundColor White
Write-Host "  User 3:     meera.subramanian@roxiler.com / UserPass123!" -ForegroundColor White
Write-Host ""
Write-Host "To start the backend: cd D:\Job Stuff\Roxiler_Systems_assignment\backend && npm run start:dev"
Write-Host "To start the frontend: cd D:\Job Stuff\Roxiler_Systems_assignment\frontend && npm run dev"