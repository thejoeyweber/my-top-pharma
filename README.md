# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run convert-all`     | Convert all data files to TypeScript             |
| `npm run create-migration <n>` | Create a new database migration file     |
| `npm run db:push`         | Apply database migrations to Supabase            |
| `npm run db:types`        | Generate TypeScript types from Supabase schema   |
| `npm run ingest-companies` | Fetch and store pharmaceutical companies from FMP API |
| `npm run test-fmp`        | Test the connection to the FMP API               |
| `npm run migrate:companies` | Migrate companies from JSON to local Supabase database |
| `npm run migrate:therapeutic-areas` | Migrate therapeutic areas from JSON to local Supabase database |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# Top Pharma

A comprehensive directory of pharmaceutical companies, products, and websites built with Astro and Supabase.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── types/
│   └── utils/
├── supabase/
│   ├── migrations/
│   └── config.toml
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run convert-all`     | Convert all data files to TypeScript             |
| `npm run create-migration <name>` | Create a new database migration file     |
| `npm run db:push`         | Apply database migrations to Supabase            |
| `npm run db:types`        | Generate TypeScript types from Supabase schema   |
| `npm run ingest-companies` | Fetch and store pharmaceutical companies from FMP API |
| `npm run test-fmp`        | Test the connection to the FMP API               |

## 🔌 Supabase Integration

This project uses Supabase as its backend database and authentication provider.

### Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from the Supabase dashboard (Settings > API)
3. Update the `.env` file with your Supabase credentials:

```
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Link your local project to your Supabase project:

```
npx supabase login
npx supabase link --project-ref your-project-id
```

### Database Migrations

The database schema is defined in SQL migration files located in the `supabase/migrations/` directory.

#### Applying Migrations

Run the following command to apply all pending migrations:

```bash
npx supabase db push
```

#### Creating New Migrations

When you need to modify the database schema:

1. Create a new migration file with a timestamp prefix in the `supabase/migrations/` directory:

```bash
touch supabase/migrations/$(date +%Y%m%d)_descriptive_name.sql
```

2. Add your SQL statements to the file
3. Apply the migration with `npx supabase db push`

See the `supabase/README.md` file for more detailed migration guidelines.

### Testing the Connection

Visit `/supabase-test` in your local development server to verify that your Supabase connection is working correctly.

## 📡 Financial Modeling Prep API Integration

This project uses the Financial Modeling Prep (FMP) API to fetch data about pharmaceutical companies.

### Setup

1. Sign up for an API key at [financialmodelingprep.com](https://financialmodelingprep.com)
2. Add your API key to the `.env` file:

```
PUBLIC_FMP_API_KEY=your-fmp-api-key
```

### Data Ingestion

The project includes a data ingestion script that fetches pharmaceutical companies from the FMP API and stores them in Supabase:

```bash
npm run ingest-companies
```

This script:
1. Fetches pharmaceutical and biotech companies from the FMP screener
2. Retrieves detailed company profiles for each company
3. Transforms the data to match the database schema
4. Stores the data in the Supabase `companies` table
5. Creates a backup JSON file in `data/backups/`

### API Client

The FMP API client is located in `src/lib/fmp.ts` and provides typed interfaces for interacting with the FMP API. The client handles:

- API authentication
- Rate limiting
- Error handling
- Type conversion

For detailed information about the FMP integration, see [FMP Integration Documentation](./docs/fmp-integration.md).

### Data Mapping

The FMP data mapper (`src/lib/fmpMapper.ts`) transforms data from the FMP API format to the internal database schema, handling:

- Field mapping
- Data normalization
- Slug generation
- Type conversion

## 📊 Data Model

The application uses the following primary data models:

- **Companies**: Pharmaceutical and biotech companies
- **Products**: Drugs and therapies (both approved and in pipeline)
- **Websites**: Company-owned websites categorized by purpose
- **Therapeutic Areas**: Medical domains (e.g., Oncology, Cardiology)

## 🔄 Data Flow

1. External data is ingested from sources like Financial Modeling Prep (FMP)
2. Data is stored in Supabase
3. The Astro frontend fetches and displays this data
4. Updates are performed on a scheduled basis

## 🛠️ Development

To start development:

1. Clone this repository
2. Install dependencies with `npm install`
3. Set up your `.env` file with Supabase credentials
4. Link to your Supabase project with `npx supabase link --project-ref your-project-id`
5. Apply migrations with `npx supabase db push`
6. Run `npm run dev` to start the development server

## Data Structure

The application currently uses JSON files for data storage, located in `src/data/json/`. SVG assets are stored in `src/data/assets/`. We are in the process of migrating to Supabase for data storage.

### Data Files

- `companies.json`: Information about pharmaceutical companies
- `products.json`: Information about pharmaceutical products
- `websites.json`: Information about pharmaceutical websites
- `therapeuticAreas.json`: List of therapeutic areas
- `indications.json`: List of medical indications
- `websiteCategories.json`: Categories for websites
- `regions.json`: Geographic regions
- `systemStats.json`: System statistics for the admin dashboard
- `userProfile.json`: User profile information
- `userPreferences.json`: User preferences
- `followedCompanies.json`: Companies followed by the user

### Asset Files

SVG assets are stored in the following directories:

- `src/data/assets/logos/`: Company logos
- `src/data/assets/products/`: Product images
- `src/data/assets/screenshots/`: Website screenshots
- `src/data/assets/icons/`: Icons used in the application

## Data Utilities

The `src/utils/dataUtils.ts` file provides utility functions for loading data from JSON files and resolving asset paths.

### Loading Data

```typescript
// Get all companies
const companies = await getCompanies();

// Get a specific company by ID
const company = await getCompanyById('pfizer');

// Get all products for a company
const products = await getProductsByCompany('pfizer');
```

## Type Definitions

Type definitions for the data are located in `src/types/`:

- `companies.ts`: Types for company data
- `products.ts`: Types for product data
- `websites.ts`: Types for website data
- `user.ts`: Types for user data
- `admin.ts`: Types for admin data
- `database.ts`: Types for Supabase database schema

## 🗄️ Local Supabase Development

This project supports toggling between local and remote Supabase instances for development and testing. Using a local Supabase instance provides several benefits:

- Develop and test without internet connectivity
- Make schema changes without affecting the production database
- Reset the database to a clean state at any time
- Avoid rate limits and quota restrictions

### Prerequisites

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

### Setting Up Local Supabase

1. Start Docker Desktop
2. Initialize Supabase (first time only):
   ```bash
   npx supabase init
   ```
3. Start the local Supabase instance:
   ```bash
   npx supabase start
   ```
4. Copy the local URL and anon key to your `.env.local` file:
   ```bash
   PUBLIC_LOCAL_SUPABASE_URL=http://localhost:54321
   PUBLIC_LOCAL_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
   ```
5. Apply database migrations:
   ```bash
   npm run db:push
   ```
6. Migrate data from JSON to local database:
   ```bash
   npm run migrate:companies
   npm run migrate:therapeutic-areas
   ```

### Accessing Local Supabase Dashboard

- Supabase Studio: [http://localhost:54323](http://localhost:54323)
- API Documentation: [http://localhost:54321/rest/v1/](http://localhost:54321/rest/v1/)

### Common Tasks

- Reset the local database:
  ```bash
  npx supabase db reset
  ```
- View logs:
  ```bash
  npx supabase logs
  ```
- Stop the local instance:
  ```bash
  npx supabase stop
  ```

### Testing Connection Status

You can verify the database connection status and toggle between local and remote instances using the admin dashboard:

1. Navigate to `/admin/data-feeds/connection-test`
2. Toggle the "Use Local Supabase Instance" switch
3. Check the connection status for both local and remote instances

### Additional Resources

- [Supabase Local Development](https://supabase.com/docs/guides/local-development)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
