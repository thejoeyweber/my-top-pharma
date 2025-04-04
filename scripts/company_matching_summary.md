# Company Name Matching: Final Analysis and Insights

## Summary Statistics
- **Total FMP companies with matches**: 307
- **Total aliases found**: 879
- **Average aliases per company**: 2.86
- **Match quality**:
  - 94.2% of matches have confidence score ≥ 0.95
  - 39.6% are exact matches (confidence = 1.0)

## Match Type Distribution
- **Exact matches**: 347 (39.5%)
- **Abbreviation matches**: 474 (53.9%)
- **Fuzzy matches**: 57 (6.5%)
- **Token matches**: 1 (0.1%)

## Confidence Score Distribution
- **Score 1.0**: 348 (39.6%)
- **Score 0.95-0.99**: 480 (54.6%)
- **Score 0.90-0.94**: 10 (1.1%)
- **Score 0.85-0.89**: 41 (4.7%)

## Companies with Most Aliases
1. Dr. Reddy's Laboratories Limited (12 aliases)
2. AstraZeneca PLC (10 aliases)
3. Bristol-Myers Squibb Company (9 aliases)
4. Teva Pharmaceutical Industries Limited (8 aliases)
5. Acadia Pharmaceuticals Inc. (8 aliases)

## Key Challenges Addressed

### 1. Name Variations
We observed multiple naming conventions for the same company across datasets:
- Legal entity suffixes (Inc., Ltd., Corporation)
- Geographic indicators (USA, America)
- Punctuation and spacing differences
- Abbreviated vs. full names

**Solution**: Applied normalization techniques to standardize names before matching.

### 2. Abbreviations and Acronyms
Many pharmaceutical companies appear as acronyms in one dataset and full names in another.

**Example**: "AZN" ↔ "AstraZeneca"

**Solution**: Implemented a dedicated abbreviation matching algorithm.

### 3. Subsidiary Relationships
Companies often have complex ownership structures with subsidiaries using different names.

**Example**: "Genentech" is a subsidiary of "Roche"

**Solution**: Captured these relationships through fuzzy matching and manual verification.

### 4. False Positives
Initial matching identified some incorrect associations due to similar names.

**Example**: "Amgen" and "Amgen Inc" are correct matches, but "Amgen" and "Amarin" are not.

**Solution**: Implemented confidence thresholds and post-processing to filter out low-quality matches.

## Data Quality Observations

1. **FMP Dataset**:
   - More consistent naming conventions
   - Always includes legal entity type
   - Some companies may be holding entities rather than direct pharmaceutical manufacturers

2. **OpenFDA Dataset**:
   - More variations in company naming
   - Includes manufacturing divisions not listed separately in financial data
   - Contains more abbreviated forms

## Business Impact

- **Expanded coverage**: Successfully matched 307 publicly traded pharmaceutical companies to their FDA product data
- **Enhanced data integration**: Created a robust mapping that can link financial metrics to pharmaceutical products
- **Improved analysis capabilities**: Enables correlation between financial performance and pharmaceutical product portfolios

## Recommendations

1. **Maintenance process**: Establish a quarterly review of the matcher to incorporate new companies and naming variations
2. **Validation workflow**: Implement a human-in-the-loop validation for low-confidence matches
3. **Metadata enrichment**: Add additional company identifiers (DUNS, LEI) to improve future matching
4. **Extended matching**: Consider expanding the matching to include private pharmaceutical companies 