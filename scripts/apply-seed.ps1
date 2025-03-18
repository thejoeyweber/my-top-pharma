# Script to run the Supabase seed data on the local database
Write-Host "Applying seed data to local Supabase database..."

# Change to project root directory
cd $PSScriptRoot/..

# Reset the database schema (optional - uncomment if needed)
# Write-Host "Resetting database schema..."
# npx supabase db reset

# Apply the seed file
Write-Host "Applying seed data..."
npx supabase db query --file supabase/run-seed.sql

Write-Host "Seed data applied successfully!" 