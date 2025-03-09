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

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# Top Pharma

A comprehensive directory of pharmaceutical companies, products, and websites.

## Data Structure

The application uses JSON files for data storage, located in `src/data/json/`. SVG assets are stored in `src/data/assets/`.

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

### Resolving Asset Paths

```typescript
// Get the path to a company logo
const logoPath = getAssetPath('logo', 'pfizer');

// Get the path to a product image
const productImagePath = getAssetPath('product', 'exampla');
```

## Development

### Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Converting Data

To convert data from TypeScript files to JSON files, run:

```bash
npm run convert-data
```

This will:
1. Convert all data from TypeScript to JSON
2. Extract SVGs to separate files
3. Update references in the JSON files

## Type Definitions

Type definitions for the data are located in `src/types/`:

- `companies.ts`: Types for company data
- `products.ts`: Types for product data
- `websites.ts`: Types for website data
- `user.ts`: Types for user data
- `admin.ts`: Types for admin data

## S3 Data Lake Integration

The Top Pharma application uses S3 (or MinIO for local development) as a data lake to store raw data from various sources before processing and ingestion into the database.

### Setup

1. **Environment Variables**

   Set up the following environment variables in your `.env` file:

   ```
   S3_BUCKET_NAME=top-pharma-data-lake
   S3_ACCESS_KEY=your-access-key
   S3_SECRET_KEY=your-secret-key
   S3_ENDPOINT_URL=http://localhost:9000  # For MinIO local development
   ```

   For AWS S3, leave S3_ENDPOINT_URL blank.

2. **Local Development with MinIO**

   Run the Docker Compose setup:

   ```powershell
   cd app
   docker-compose up -d
   ```

   This will start:
   - MinIO server at http://localhost:9000 (API) and http://localhost:9001 (Console)
   - PostgreSQL database
   - Prefect Orion server

3. **Test S3 Connectivity**

   ```powershell
   cd app
   python scripts/test_s3.py
   ```

### Setting up AWS S3 Connection

For production use with AWS S3 instead of MinIO, follow these steps:

1. Create an AWS S3 bucket
2. Create an IAM user with programmatic access and attach the appropriate S3 policies
3. Update your `.env` file with the AWS credentials:

   ```
   S3_BUCKET_NAME=your-bucket-name
   S3_ACCESS_KEY=your-aws-access-key
   S3_SECRET_KEY=your-aws-secret-key
   S3_ENDPOINT_URL=  # Leave empty for AWS S3
   ```

4. Test your connection:

   ```powershell
   cd app
   python scripts/test_s3.py
   ```

### Troubleshooting

If you encounter issues with S3 connectivity:

1. Check your credentials in `.env`
2. Ensure the S3 bucket exists
3. Verify that your IAM user has the necessary permissions
4. If using MinIO, ensure the MinIO server is running
5. If using AWS S3, ensure your region is correct (defaults to the profile default)

If Docker is not available or running, you can still test the S3 client with the mock implementation:

```powershell
cd app
python scripts/test_s3_mock.py
```

### Using the S3 Client

The `utils/s3_client.py` module provides functions for interacting with S3:

- `upload_file(file_path, object_name=None, bucket_name=None)`: Upload a file to S3
- `upload_data(data, object_name, bucket_name=None)`: Upload data directly to S3
- `download_file(object_name, file_path, bucket_name=None)`: Download a file from S3
- `list_objects(prefix='', bucket_name=None)`: List objects in the bucket
- `get_date_prefixed_key(base_path, file_name)`: Generate a date-prefixed key for organizing data by date

### Using Prefect S3 Block

The `flows/blocks/s3_block.py` module defines a Prefect S3 block for storing flow artifacts:

```python
from flows.blocks.s3_block import get_s3_block

# Get or create an S3 block
s3_block = get_s3_block("my-s3-block")

# Use the block in a flow
@flow
def my_flow():
    # ...
    return "Result"

if __name__ == "__main__":
    # Deploy the flow
    my_flow.with_options(name="my-flow", storage=s3_block).deploy()
```
