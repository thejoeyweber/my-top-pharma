# Company Name Matching Solution

This directory contains scripts for matching company names between our FMP financial data and the OpenFDA pharmaceutical data sources.

## Main Script

We've consolidated all functionality into a single, comprehensive script:

- `company_matcher.py`: Handles the complete company matching pipeline

The script provides several execution modes:
```bash
python company_matcher.py --mode=match     # Run the matching algorithm
python company_matcher.py --mode=analyze   # Analyze matching results
python company_matcher.py --mode=fix       # Fix problematic matches
python company_matcher.py --mode=validate  # Validate results
python company_matcher.py --mode=all       # Run the complete pipeline (default)
```

## How It Works

The solution uses a multi-layered approach to match company names across datasets:

1. **Preprocessing**: 
   - Normalize company names by converting to lowercase
   - Remove punctuation and legal entity suffixes (Inc., Ltd., Corporation, etc.)
   - Remove geographic indicators (USA, America, etc.)

2. **Matching Techniques**:
   - **Exact Matching**: Perfect matches after preprocessing (confidence = 1.0)
   - **Token-based Matching**: Comparing sets of words using Jaccard similarity (confidence ≥ 0.9)
   - **Fuzzy String Matching**: Using Levenshtein distance to find similar names (confidence ≥ 0.85)
   - **Abbreviation Matching**: Detecting possible acronym matches (confidence = 0.95)

3. **Post-processing**:
   - Remove problematic matches with low confidence
   - Apply manual fixes for known issues
   - Retain only high-quality matches

4. **Validation**:
   - Run comprehensive validation tests
   - Generate detailed statistics and analysis

## Usage

1. Place the input files in the `_docs/temp/` directory:
   - `fmp_companies.json`: Contains FMP company data with "symbol" and "companyName" fields
   - `openfda_companies.json`: Contains OpenFDA data with "company_name" and "product_count" fields

2. Run the complete pipeline:
   ```bash
   python company_matcher.py
   ```

3. Or run individual steps as needed:
   ```bash
   python company_matcher.py --mode=match
   python company_matcher.py --mode=analyze
   python company_matcher.py --mode=fix
   python company_matcher.py --mode=validate
   ```

## Output

The script generates a `company_aliases.json` file in the `_docs/temp/` directory with the following structure:

```json
{
  "Company Name from FMP": {
    "symbol": "Stock Symbol",
    "aliases": ["OpenFDA Name 1", "OpenFDA Name 2", ...],
    "confidences": [0.95, 1.0, ...],
    "match_types": ["exact", "fuzzy", ...]
  },
  ...
}
```

## Statistics

After running the complete solution:

- 307 FMP companies matched with OpenFDA companies
- 879 total aliases found (average of 2.86 aliases per company)
- Match types distribution:
  - Exact matches: 39.5%
  - Abbreviation matches: 53.9%
  - Fuzzy matches: 6.5%
  - Token-based matches: 0.1%

## Maintenance

When adding new companies or updating names:

1. Update the input JSON files with the new data
2. Re-run the complete solution:
   ```bash
   python company_matcher.py
   ```
3. If necessary, add new manual fixes to the `MANUAL_FIXES` dictionary in the script

## Future Improvements

- Add support for more sophisticated entity resolution techniques
- Incorporate more company metadata for better matching
- Implement machine learning-based matching for improved accuracy
- Create a feedback loop to continuously improve matching based on manual corrections
- Build a graphical interface for manual review of low-confidence matches 