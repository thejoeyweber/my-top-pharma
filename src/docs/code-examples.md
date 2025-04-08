# Code Examples

This document provides examples of how to use the improved utilities and components in the refactored codebase.

## URL Parameter Handling

### Basic Usage

```ts
// Import the utility
import { updateUrlParams } from '../lib/utils/urlUtils';

// Update a single parameter
const newUrl = updateUrlParams({ page: 2 });

// Update multiple parameters
const filterUrl = updateUrlParams({
  filter: 'oncology',
  sort: 'name_asc',
  page: 1
});

// Remove a parameter by setting it to null
const removeFilterUrl = updateUrlParams({ filter: null });
```

### Preserving Parameters

```ts
// Import the utility
import { preserveParams } from '../lib/utils/urlUtils';

// Update sort parameter while preserving view mode and page
const url = preserveParams(
  { sort: 'market_cap_desc' },
  ['view', 'page']
);

// The result will maintain the current view and page parameters 
// while updating the sort parameter
```

### View Mode and Sort Helpers

```ts
// Import specific helper utilities
import { updateSortParams, updateViewParams } from '../lib/utils/urlUtils';

// Update sort while preserving view mode
const sortUrl = updateSortParams('name_asc');

// Update view mode while preserving sort and filter
const viewUrl = updateViewParams('list');
```

## Component Examples

### SortSelect Component

```astro
---
import { SortSelect } from '../components/molecules/SortSelect.astro';
---

<SortSelect
  options={[
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
    { value: 'market_cap_asc', label: 'Market Cap (Low to High)' }
  ]}
  selected="name_asc"
/>
```

### ViewToggle Component

```astro
---
import { ViewToggle } from '../components/molecules/ViewToggle.astro';

// Get the current view mode from URL params
const viewMode = Astro.url.searchParams.get('view') || 'grid';
---

<ViewToggle 
  activeOption={viewMode}
  preserveParams={['sort', 'filter', 'page']}
/>
```

## Database Type Utilities

### Type-Safe Database Access

```ts
// Import the schema utilities
import { 
  type DbRow, 
  type DbInsert, 
  createEntityMapper 
} from '../lib/utils/schemaUtils';

// Define a type for a company from the database
type CompanyRow = DbRow<'companies'>;

// Define your application entity
interface Company {
  id: string;
  name: string;
  slug: string;
  marketCap: number;
  // ...other fields
}

// Create a type-safe mapper
const mapDbCompanyToCompany = createEntityMapper<CompanyRow, Company>(
  (dbCompany) => ({
    id: dbCompany.id,
    name: dbCompany.name,
    slug: dbCompany.slug || '',
    marketCap: dbCompany.market_cap || 0,
    // ...map other fields
  })
);

// Use the mapper in your data access functions
async function getCompany(id: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !data) return null;
  
  // Type-safe conversion
  return mapDbCompanyToCompany(data);
}
```

## Hydration Utilities

### Consistent Client Directives

```astro
---
import { Button } from '../components/atoms/Button.astro';
import { SearchBar } from '../components/molecules/SearchBar.astro';
import { DataTable } from '../components/molecules/DataTable.astro';
import { getHydrationDirective } from '../lib/utils/hydrationUtils';

// Use recommended hydration directives for each component type
const buttonHydration = getHydrationDirective('button');
const searchHydration = getHydrationDirective('searchBar');
const tableHydration = getHydrationDirective('datatable');
---

<Button client:idle>Click Me</Button>
<SearchBar client:idle />
<DataTable client:visible />
```

### Direct Access to Directives

```astro
---
import { hydrationDirectives } from '../lib/utils/hydrationUtils';
---

<div>
  <!-- Critical interactive components -->
  <header client:load>
    <!-- Header content -->
  </header>
  
  <!-- Below the fold components -->
  <section client:visible>
    <!-- Expensive component -->
  </section>
</div>
``` 