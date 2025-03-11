# PowerShell script to set up and run the SEC EDGAR pipeline
# This script performs all the necessary setup steps and runs the demo

# Navigate to the app directory
$appDir = Split-Path -Parent $PSScriptRoot
Set-Location $appDir

# Activate the Python virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
.\venv\Scripts\activate

try {
    # Step 1: Check and set up the database schema
    Write-Host "Step 1: Checking and setting up database schema..." -ForegroundColor Cyan
    python scripts/check_and_setup_schema.py
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to set up database schema. Exiting." -ForegroundColor Red
        exit 1
    }
    
    # Step 2: Deploy the Company Universe flow to Prefect
    Write-Host "`nStep 2: Deploying SEC EDGAR Company Universe flow to Prefect..." -ForegroundColor Cyan
    python scripts/deploy_company_universe.py
    
    # Step 3: Start a Prefect agent in the background
    Write-Host "`nStep 3: Starting Prefect agent in the background..." -ForegroundColor Cyan
    Start-Process -FilePath "python" -ArgumentList "scripts/start_prefect_agent.py" -WindowStyle Hidden
    
    # Give the agent a moment to start up
    Write-Host "Waiting for agent to start up..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    
    # Step 4: Run the full demo
    Write-Host "`nStep 4: Running the full demonstration flow..." -ForegroundColor Cyan
    python scripts/run_full_demo.py
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Setup and demo completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ Demo completed with issues. Check the logs above for details." -ForegroundColor Yellow
    }
    
    # Step 5: Check if the flow can be run directly
    Write-Host "`nStep 5: Verifying the company universe flow can be run directly..." -ForegroundColor Cyan
    python -m flows.sec_edgar.company_universe_flow
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Direct flow execution succeeded!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Direct flow execution failed. Check the logs above for details." -ForegroundColor Red
    }
    
    # Provide next steps
    Write-Host "`nNext Steps:" -ForegroundColor Blue
    Write-Host "1. Access Prefect UI: http://localhost:4200" -ForegroundColor White
    Write-Host "2. Access MinIO Console: http://localhost:9001 (login: minioadmin/minioadmin)" -ForegroundColor White
    Write-Host "3. Query the database with: docker exec mytoppharma-postgres-1 psql -U postgres -d toppharma -c 'SELECT * FROM sec_companies LIMIT 5;'" -ForegroundColor White
} catch {
    Write-Host "❌ An error occurred during setup: $_" -ForegroundColor Red
} finally {
    # Deactivate the virtual environment
    deactivate
    Write-Host "Virtual environment deactivated." -ForegroundColor Gray
} 