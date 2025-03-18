# Database Schema Updates

This document outlines the schema changes made to support frontend requirements and ensure consistency between database and application models.

## Migration Files

The schema changes are implemented in the following migration files:

1. `app/supabase/migrations/20250318000000_update_schema_for_frontend.sql`
   - Modifies field types for consistency
   - Adds missing columns
   - Creates new tables for user features

2. `app/supabase/migrations/20250318000001_rename_columns.sql`
   - Renames `stock_symbol` to `ticker_symbol` for consistency

## Changes to Existing Tables

### Companies Table

- Changed `founded` from VARCHAR to INTEGER
- Added `logo_url` and `header_image_url` columns
- Renamed `stock_symbol` to `ticker_symbol`

### Products Table

- Added `status` column for approved/pending status
- Added `year` column for year of release/approval

### Therapeutic Areas Table

- Added `icon_path` column for UI display

### Websites Table

- Added `screenshot_date` column to track when screenshots were taken

## New Tables

### Development Phases

Reference data for pharmaceutical development phases:

```sql
CREATE TABLE IF NOT EXISTS development_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  order_num INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### User-Related Tables

For supporting user preferences and activity:

```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_frequency VARCHAR(20) DEFAULT 'daily',
  email_notifications BOOLEAN DEFAULT true,
  theme VARCHAR(20) DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS user_followed_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  entity_id UUID,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## Applying Changes

To apply these schema changes:

1. Run migrations: 
   ```
   npx supabase migration up
   ```

2. Generate updated TypeScript types:
   ```
   scripts/generate-types.ps1
   ```

3. Apply seed data:
   ```
   scripts/apply-seed.ps1
   ```

## Frontend TypeScript Interfaces

The schema changes are reflected in TypeScript interfaces in:

- `src/types/entities.ts` - Core entity interfaces
- `src/utils/transformations.ts` - Data transformation functions

These provide type safety and proper field mapping between the database and frontend. 