# Migration Utilities

This directory contains utilities for managing database migrations in the MyTopPharma project.

## Available Utilities

### 1. Migrate to SQL-Based Approach

**Script:** `migrate-to-sql-based-approach.js`  
**NPM Command:** `npm run db:migrate-to-sql`

This utility helps transition from TypeScript-based migration scripts to the new SQL-based approach using Supabase migrations and seed files. It performs the following tasks:

1. Verifies that consolidated migrations exist
2. Checks that seed.sql contains the necessary data
3. Provides guidance on removing the deprecated TypeScript scripts

**Usage:**
```bash
node scripts/migration-utils/migrate-to-sql-based-approach.js
# or
npm run db:migrate-to-sql
```

### 2. Merge Migrations

**Script:** `merge-migrations.js`  
**NPM Command:** `npm run db:merge-migrations`

This utility helps merge multiple migration files into a single consolidated file. It's useful for cleaning up and organizing migrations before deploying to production.

**Usage:**
```bash
node scripts/migration-utils/merge-migrations.js <output-name> <file1> <file2> ...
# or
npm run db:merge-migrations -- <output-name> <file1> <file2> ...
```

**Example:**
```bash
node scripts/migration-utils/merge-migrations.js consolidated_schema migration1.sql migration2.sql
```

## Best Practices

1. **Consolidate Regularly:** Periodically consolidate migrations to keep the migration history clean and manageable.
2. **Test After Merging:** Always test consolidated migrations against a local database before pushing to production.
3. **Include Transaction Blocks:** Ensure all migrations include proper transaction blocks (BEGIN/COMMIT) for safety.
4. **Document Changes:** Add clear comments in consolidated migrations to explain the purpose of each section.
5. **Version Control:** Keep all migrations in version control, even after consolidation.

## Migration Workflow

For a complete guide to the migration workflow, see the [Supabase README](../../supabase/README.md) file. 