# Therapeutic Areas Implementation

This document provides an overview of the therapeutic areas standardization implementation in the Top Pharma application.

## Overview

The therapeutic areas system uses the Healthcare Provider Taxonomy Code Set (HPTCS) as the primary classification system, with MeSH references for interoperability. This provides a standardized vocabulary for therapeutic areas across the application.

## Database Schema

The implementation includes the following tables:

1. `therapeutic_areas` - Main table for storing therapeutic area information
   - `id` - HPTCS code (primary key)
   - `name` - Display name
   - `slug` - URL-friendly version of the name
   - `mesh_specialty_id` - MeSH specialty reference (optional)
   - `mesh_disease_id` - MeSH disease reference (optional)
   - `description` - Description (optional)
   - `level` - Hierarchy level
   - `parent_id` - Parent reference (optional)

2. `company_therapeutic_areas` - Join table linking companies to therapeutic areas
   - `company_id` - Reference to company
   - `therapeutic_area_id` - Reference to therapeutic area

3. `product_therapeutic_areas` - Join table linking products to therapeutic areas
   - `product_id` - Reference to product
   - `therapeutic_area_id` - Reference to therapeutic area

4. `pharm_class_mappings` - Mapping table for FDA Established Pharmacologic Classes to therapeutic areas
   - `id` - Primary key
   - `pharm_class` - Pharmacologic class name
   - `class_type` - Type of class (e.g., EPC, MoA)
   - `therapeutic_area_id` - Reference to therapeutic area

## Data Import

The data import process is handled by the `import-therapeutic-areas.ts` script, which:

1. Downloads the NUCC Taxonomy CSV file
2. Extracts relevant specialties
3. Maps specialties to MeSH IDs
4. Generates pharmaceutical class mappings
5. Writes the data to JSON and inserts it into the database

## Utility Functions

The `therapeuticAreaUtils.ts` file provides utility functions for working with therapeutic areas:

- `mapLegacyTherapeuticAreas()` - Converts legacy data to the new format
- `getAllTherapeuticAreas()` - Gets all therapeutic areas
- `getTherapeuticAreaById()` - Gets a therapeutic area by ID
- `getTherapeuticAreaBySlug()` - Gets a therapeutic area by slug
- `classifyProductByEPC()` - Classifies products based on their Established Pharmacologic Classes
- `classifyProductByRxCUI()` - Classifies products by their RxCUI (placeholder)

## Feature Flags

The system uses the following feature flag to control the data source:

- `USE_DATABASE_THERAPEUTIC_AREAS` - When enabled, therapeutic areas are loaded from the database; otherwise, they are loaded from JSON files.

## References

- [Healthcare Provider Taxonomy Code Set](https://nucc.org/index.php/code-sets-mainmenu-41/provider-taxonomy-mainmenu-40)
- [MeSH Browser](https://meshb.nlm.nih.gov/search)
- [FDA Established Pharmacologic Classes](https://www.fda.gov/industry/structured-product-labeling-resources/pharmacologic-class)

## Usage

### Adding a New Therapeutic Area

To add a new therapeutic area:

1. Insert a new record into the `therapeutic_areas` table
2. Ensure it has a unique ID (HPTCS code)
3. Provide a name and slug
4. Set the appropriate level and parent_id if it's part of a hierarchy

### Associating Companies with Therapeutic Areas

To associate a company with a therapeutic area:

1. Insert a record into the `company_therapeutic_areas` table
2. Set the `company_id` and `therapeutic_area_id` fields

### Classifying Products

Products can be classified automatically using their Established Pharmacologic Classes:

```typescript
import { classifyProductByEPC } from '../utils/therapeuticAreaUtils';

// Example usage
const therapeuticAreaIds = await classifyProductByEPC(['HMG-CoA Reductase Inhibitor']);
```

## Maintenance

The NUCC Taxonomy is updated twice a year. To update the therapeutic areas:

1. Run the `import-therapeutic-areas.ts` script with the latest CSV file
2. Review any changes to ensure they don't break existing associations
3. Update the `pharm_class_mappings` table as needed for new pharmaceutical classes 