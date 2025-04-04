# MyTopPharma Scripts

This directory contains utility scripts for the MyTopPharma application.

## Company Name Matching

We've successfully implemented a company name matching system that links publicly traded pharmaceutical companies from Financial Modeling Prep (FMP) with their corresponding names in the OpenFDA dataset.

### Main Script:

- `company_matcher.py`: A consolidated script that handles the complete matching pipeline

This script provides several execution modes:
```bash
python company_matcher.py --mode=match     # Run the matching algorithm
python company_matcher.py --mode=analyze   # Analyze matching results
python company_matcher.py --mode=fix       # Fix problematic matches
python company_matcher.py --mode=validate  # Validate results
python company_matcher.py --mode=all       # Run the complete pipeline
```

### Results:

- Successfully matched 307 publicly traded pharmaceutical companies
- Generated 879 aliases with an average of 2.86 aliases per company
- 94.2% of matches have high confidence scores (≥0.95)
- Match types distribution: 39.5% exact matches, 53.9% abbreviation matches, 6.5% fuzzy matches

### Documentation:

- `README_company_matching.md`: Detailed documentation of the matching solution
- `company_matching_summary.md`: Analysis and insights from the matching process

## How It Works

The company matching script uses a multi-layered approach:

1. **Matching**: First applies exact, abbreviation, token-based, and fuzzy matching techniques
2. **Analysis**: Analyzes the quality of matches with detailed statistics
3. **Fixing**: Identifies and fixes problematic matches, applying both automatic and manual fixes
4. **Validation**: Runs a series of validation tests to ensure match quality

## Validation

The script includes built-in validation tests:

1. Coverage test: Ensures we've matched enough companies
2. Alias uniqueness test: Checks for excessive duplicate aliases
3. Confidence score test: Verifies high confidence in our matches
4. Match type distribution test: Ensures we're not relying too heavily on fuzzy matching
5. Source data test: Confirms matches reference existing company names
6. Normalized match test: Verifies the quality of exact matches

## Next Steps

1. Implement quarterly reviews to update with new companies
2. Add human-in-the-loop validation for low-confidence matches
3. Extend matching to private pharmaceutical companies
4. Integrate additional company identifiers to improve matching 