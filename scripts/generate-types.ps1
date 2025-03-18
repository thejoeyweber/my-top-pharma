# Script to generate TypeScript types from Supabase database
Write-Host "Generating TypeScript types from Supabase schema..."

# Change to project root directory
cd $PSScriptRoot/..

# Generate types
npx supabase gen types typescript --local > src/types/database.ts

Write-Host "Database types updated successfully!" 