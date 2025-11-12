# RabbitMQ Setup Script for Windows
# This script helps set up RabbitMQ for PDF generation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EKYC RabbitMQ Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if RabbitMQ is installed
Write-Host "Checking if RabbitMQ is installed..." -ForegroundColor Yellow

$rabbitmqPath = "$env:ProgramFiles\RabbitMQ Server"
$rabbitmqInstalled = Test-Path $rabbitmqPath

if ($rabbitmqInstalled) {
    Write-Host "✓ RabbitMQ is installed at: $rabbitmqPath" -ForegroundColor Green
} else {
    Write-Host "✗ RabbitMQ is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation Options:" -ForegroundColor Yellow
    Write-Host "1. Using Chocolatey: choco install rabbitmq" -ForegroundColor White
    Write-Host "2. Download installer: https://www.rabbitmq.com/install-windows.html" -ForegroundColor White
    Write-Host ""
    
    $install = Read-Host "Do you want to install RabbitMQ using Chocolatey? (y/n)"
    
    if ($install -eq "y" -or $install -eq "Y") {
        # Check if Chocolatey is installed
        if (Get-Command choco -ErrorAction SilentlyContinue) {
            Write-Host "Installing RabbitMQ..." -ForegroundColor Yellow
            choco install rabbitmq -y
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ RabbitMQ installed successfully" -ForegroundColor Green
                $rabbitmqInstalled = $true
            } else {
                Write-Host "✗ Failed to install RabbitMQ" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "✗ Chocolatey is not installed" -ForegroundColor Red
            Write-Host "Install Chocolatey from: https://chocolatey.org/install" -ForegroundColor White
            exit 1
        }
    } else {
        Write-Host "Please install RabbitMQ manually and run this script again." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Check if RabbitMQ service is running
Write-Host "Checking RabbitMQ service status..." -ForegroundColor Yellow

$service = Get-Service -Name "RabbitMQ" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq "Running") {
        Write-Host "✓ RabbitMQ service is running" -ForegroundColor Green
    } else {
        Write-Host "RabbitMQ service is $($service.Status)" -ForegroundColor Yellow
        Write-Host "Attempting to start RabbitMQ service..." -ForegroundColor Yellow
        
        try {
            Start-Service -Name "RabbitMQ"
            Write-Host "✓ RabbitMQ service started successfully" -ForegroundColor Green
        } catch {
            Write-Host "✗ Failed to start RabbitMQ service" -ForegroundColor Red
            Write-Host "Error: $_" -ForegroundColor Red
            Write-Host "Try running as Administrator" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✗ RabbitMQ service not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Check if Management Plugin is enabled
Write-Host "Checking RabbitMQ Management Plugin..." -ForegroundColor Yellow

$rabbitmqPlugins = "$rabbitmqPath\rabbitmq_server-*\sbin\rabbitmq-plugins.bat"
$pluginScript = Get-Item $rabbitmqPlugins -ErrorAction SilentlyContinue | Select-Object -First 1

if ($pluginScript) {
    $plugins = & $pluginScript.FullName list
    
    if ($plugins -match "rabbitmq_management.*enabled") {
        Write-Host "✓ Management Plugin is enabled" -ForegroundColor Green
    } else {
        Write-Host "Enabling Management Plugin..." -ForegroundColor Yellow
        & $pluginScript.FullName enable rabbitmq_management
        Write-Host "✓ Management Plugin enabled" -ForegroundColor Green
        Write-Host "Restarting RabbitMQ service..." -ForegroundColor Yellow
        Restart-Service -Name "RabbitMQ"
    }
}

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Update .env file
Write-Host "Updating .env configuration..." -ForegroundColor Yellow

$envFile = Join-Path $PSScriptRoot ".env"
$envExists = Test-Path $envFile

if ($envExists) {
    $envContent = Get-Content $envFile -Raw
    
    if ($envContent -notmatch "RABBITMQ_URL") {
        Write-Host "Adding RABBITMQ_URL to .env file..." -ForegroundColor Yellow
        Add-Content -Path $envFile -Value "`n# RabbitMQ Configuration`nRABBITMQ_URL=amqp://localhost:5672"
        Write-Host "✓ RABBITMQ_URL added to .env" -ForegroundColor Green
    } else {
        Write-Host "✓ RABBITMQ_URL already exists in .env" -ForegroundColor Green
    }
} else {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ekyc

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
"@ | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "✓ .env file created" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "RabbitMQ Management UI: http://localhost:15672" -ForegroundColor Cyan
Write-Host "Default credentials: guest / guest" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Install dependencies: npm install" -ForegroundColor White
Write-Host "2. Start the server: npm start" -ForegroundColor White
Write-Host "3. Test PDF generation via API" -ForegroundColor White
Write-Host ""
Write-Host "Documentation: backend/PDF_GENERATION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
