# Database Migration Update

> **IMPORTANT: The database migrations have been moved to the `/supabase/migrations/` directory.**

We've standardized on the Supabase CLI approach for database migrations. All future migrations should be created and managed in the `/supabase/migrations/` directory.

Please refer to the `/supabase/README.md` file for detailed information about the migration workflow and best practices.

## Migration 

To ensure consistency across our development environments, we now use the Supabase CLI for applying migrations:

```bash
npx supabase db push
```

## Why We Moved

The Supabase CLI approach offers several advantages:
- Version-controlled migrations with timestamp prefixes
- Automatic tracking of applied migrations
- Consistent deployment across environments
- Integration with CI/CD pipelines

This `/db` directory is maintained for historical reference but is deprecated for new migrations. 