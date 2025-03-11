# PowerShell script to run the SEC EDGAR Company Universe Flow
# This script activates the virtual environment and runs the flow directly

# Navigate to the app directory
$appDir = Split-Path -Parent $PSScriptRoot
Set-Location $appDir

# Activate the Python virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
.\venv\Scripts\activate

try {
    # Run the company universe flow
    Write-Host "Running SEC EDGAR Company Universe Flow..." -ForegroundColor Cyan
    python -m flows.sec_edgar.company_universe_flow
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Flow completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Flow failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ An error occurred while running the flow: $_" -ForegroundColor Red
} finally {
    # Deactivate the virtual environment
    deactivate
    Write-Host "Virtual environment deactivated." -ForegroundColor Gray
} 