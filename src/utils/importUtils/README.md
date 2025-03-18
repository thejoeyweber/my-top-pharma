# Data Import Utilities

This directory contains utilities for importing data from external sources into the application database.

## Overview

The import utilities provide a standardized way to fetch, transform, and store data from various sources. They handle common tasks such as:

- Connection setup and validation
- Data fetching with rate limiting
- Data transformation and validation
- Database operations (insert/update)
- Error handling and logging
- Backup creation

## Architecture

The import utilities follow a class-based architecture with a base abstract class and specific implementations for each data source:

```
BaseImporter (abstract)
  ├── FMPCompanyImporter
  ├── TherapeuticAreaImporter (future)
  └── ProductImporter (future)
```

### BaseImporter

The `BaseImporter` class provides common functionality for all importers:

- Database connection setup
- Batch database operations
- Backup file creation
- Import statistics tracking
- Error handling and logging

### Specific Importers

Each specific importer extends the `BaseImporter` class and implements the `executeImport` method to handle the specific logic for that data source.

## Usage

### Running an Import

To run an import, create an instance of the specific importer and call the `import` method:

```typescript
import { FMPCompanyImporter } from '../src/utils/importUtils/FMPCompanyImporter';

async function main() {
  const importer = new FMPCompanyImporter();
  const results = await importer.import();
  console.log('Import completed:', results);
}

main().catch(console.error);
```

### Using the NPM Scripts

The project includes NPM scripts for running imports:

```bash
# Import companies from FMP
npm run data:import-companies

# Import therapeutic areas
npm run data:import-therapeutic-areas
```

## Environment Variables

The importers require the following environment variables:

- `PUBLIC_SUPABASE_URL`: The URL of your Supabase project
- `PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project
- `FMP_API_KEY`: API key for Financial Modeling Prep (for FMPCompanyImporter)

## Creating a New Importer

To create a new importer:

1. Create a new class that extends `BaseImporter`
2. Implement the `executeImport` method
3. Add any specific methods needed for your data source
4. Create a script to run the importer

Example:

```typescript
import { BaseImporter } from './BaseImporter';

export class MyNewImporter extends BaseImporter {
  constructor() {
    // Pass data source ID, table name, and backup directory name
    super(3, 'my_table', 'my_backup_dir');
  }

  protected async executeImport(): Promise<void> {
    // Fetch data from source
    const data = await this.fetchData();
    
    // Transform data
    const transformedData = this.transformData(data);
    
    // Save backup
    await this.saveBackup(transformedData);
    
    // Insert into database
    await this.batchUpsert(transformedData);
  }

  private async fetchData(): Promise<any[]> {
    // Implementation specific to your data source
  }

  private transformData(data: any[]): any[] {
    // Implementation specific to your data source
  }
}
``` 