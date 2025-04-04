#!/usr/bin/env python3
"""
Company Name Matcher

A consolidated script that handles company name matching between datasets,
analyzing results, fixing problematic matches, and validating the output.

Usage:
    python company_matcher.py --mode=match  # Run the matching algorithm
    python company_matcher.py --mode=analyze  # Analyze matching results
    python company_matcher.py --mode=fix  # Fix problematic matches
    python company_matcher.py --mode=validate  # Validate results
    python company_matcher.py --mode=all  # Run the complete pipeline
"""

import json
import os
import re
import sys
import argparse
from collections import Counter
import difflib
from typing import Dict, List, Tuple, Set, Any, Optional, Union

# File paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))
TEMP_DIR = os.path.join(ROOT_DIR, '_docs', 'temp')
FMP_COMPANIES_FILE = os.path.join(TEMP_DIR, 'fmp_companies.json')
OPENFDA_COMPANIES_FILE = os.path.join(TEMP_DIR, 'openfda_companies.json')
ALIASES_FILE = os.path.join(TEMP_DIR, 'company_aliases.json')

# Constants
MIN_EXACT_MATCH_CONFIDENCE = 1.0
MIN_TOKEN_MATCH_CONFIDENCE = 0.9
MIN_FUZZY_MATCH_CONFIDENCE = 0.85
ABBREVIATION_MATCH_CONFIDENCE = 0.95

# Validation thresholds
MIN_EXPECTED_MATCHES = 250
MAX_DUPLICATED_ALIASES = 5  # Max allowed percentage of duplicated aliases
MIN_HIGH_CONFIDENCE = 90    # Min percentage of matches with confidence >= 0.95

# Known problematic companies with manual fixes
MANUAL_FIXES = {
    "Dr. Reddy's Laboratories Limited": {
        "keep": ["DR REDDYS", "Dr. Reddy's Laboratories Inc.", "DR REDDYS LABS LTD", 
                "Dr. Reddy's Laboratories Limited", "Dr. Reddy's Laboratories, Inc.", 
                "Dr. Reddy's Laboratories Inc", "Dr.Reddy's Laboratories Limited", 
                "Dr. Reddys Laboratories Inc.", "Dr.Reddys Laboratories Inc", 
                "DR REDDYS LABS INC", "Dr. Reddys Laboratories, Inc.", "Dr.Reddy's Laboratories Inc.,"]
    },
    "Flexion Therapeutics, Inc.": {
        "remove_all": True 
    },
    "Adagene Inc.": {
        "remove_all": True
    },
    "Niagen Bioscience Inc": {
        "remove_all": True
    },
    "Belite Bio, Inc": {
        "remove_all": True
    },
    "Axcella Health Inc.": {
        "remove_all": True
    },
    "Novan, Inc.": {
        "remove_all": True
    },
    "Novo Nordisk A/S": {
        "keep": ["NOVO NORDISK INC", "NOVO", "Novo Nordisk"]
    },
    "Qualigen Therapeutics, Inc.": {
        "remove_all": True
    },
    "Teva Pharmaceutical Industries Limited": {
        "keep": ["TEVA", "Teva Pharmaceuticals USA, Inc.", "TEVA PHARMS USA", 
                "Teva Pharmaceuticals, Inc.", "TEVA PHARMS", "TEVA PHARMS USA INC", 
                "TEVA BRANDED PHARM", "Teva Parenteral Medicines, Inc.", 
                "TEVA PHARMS INC", "Teva Neuroscience, Inc.", "TEVA RESPIRATORY"]
    }
}

# Common pharmaceutical abbreviations
PHARMA_ABBREVS = {
    "pharm": "pharmaceutical",
    "pharms": "pharmaceuticals",
    "pharmaceuticals": "pharmaceutical",
    "pharmaceutical": "pharmaceutical",
    "labs": "laboratories",
    "lab": "laboratory",
    "laboratory": "laboratory",
    "laboratories": "laboratory"
}

# -------------------------------------------------------------------------
# Utility Functions
# -------------------------------------------------------------------------

def normalize_company_name(name: str) -> str:
    """
    Normalize company name for comparison by removing legal suffixes,
    punctuation, and standardizing case.
    """
    if not name:
        return ""
    
    # Convert to lowercase
    normalized = name.lower()
    
    # Remove legal entity types
    entity_suffixes = [
        r'\binc\.?$', r'\bcorp\.?$', r'\bcorporation$', r'\bltd\.?$', r'\bplc$', 
        r'\bco\.?$', r'\bcompany$', r'\bs\.?a\.?$', r'\bindustries$', r'\blaboratories$',
        r'\bpharmaceuticals?$', r'\bholdings?$', r'\bgroup$', r'\bthe$', r'\blimited$',
        r'\binternational$', r'\bn\.?v\.?$', r'\bs\.?p\.?a\.?$', r'\ba\.?g\.?$'
    ]
    
    for suffix in entity_suffixes:
        normalized = re.sub(suffix, '', normalized)
    
    # Remove punctuation and extra spaces
    normalized = re.sub(r'[^\w\s]', ' ', normalized)
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    
    # Remove common geographic indicators
    geo_indicators = [
        r'\busa$', r'\bamerica$', r'\bamerican$', r'\bamericas$', 
        r'\bchina$', r'\bchinese$', r'\bjapan$', r'\bjapanese$',
        r'\beurope$', r'\beuropean$', r'\basia$', r'\basian$'
    ]
    
    for indicator in geo_indicators:
        normalized = re.sub(indicator, '', normalized)
    
    # Final cleanup of extra spaces
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    
    return normalized

def further_normalize(name: str) -> str:
    """Apply pharmaceutical-specific normalizations"""
    words = name.split()
    normalized_words = []
    
    for word in words:
        if word in PHARMA_ABBREVS:
            normalized_words.append(PHARMA_ABBREVS[word])
        else:
            normalized_words.append(word)
            
    return " ".join(normalized_words)

def load_companies() -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """Load company data from both datasets."""
    try:
        with open(FMP_COMPANIES_FILE, 'r', encoding='utf-8') as f:
            fmp_companies = json.load(f)
        
        with open(OPENFDA_COMPANIES_FILE, 'r', encoding='utf-8') as f:
            openfda_companies = json.load(f)
            
        return fmp_companies, openfda_companies
    except Exception as e:
        print(f"Error loading company data: {e}")
        sys.exit(1)

def load_aliases() -> Dict[str, Any]:
    """Load existing company aliases."""
    try:
        with open(ALIASES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("No existing aliases file found. Will create a new one.")
        return {}
    except Exception as e:
        print(f"Error loading aliases file: {e}")
        return {}

def save_aliases(aliases: Dict[str, Any]) -> None:
    """Save company aliases to file."""
    try:
        with open(ALIASES_FILE, 'w', encoding='utf-8') as f:
            json.dump(aliases, f, indent=2)
        print(f"Saved aliases to {ALIASES_FILE}")
    except Exception as e:
        print(f"Error saving aliases file: {e}")

def is_abbreviation(short: str, long: str) -> bool:
    """Check if short is an abbreviation of long."""
    if not short or not long:
        return False
    
    # Common case: short is all uppercase and each letter matches the first letter of a word in long
    if short.isupper() and len(short) > 1:
        words = long.upper().split()
        if len(short) == len(words) and all(word.startswith(letter) for word, letter in zip(words, short)):
            return True
            
        # Check if short matches first letters of words in long
        first_letters = ''.join(word[0] for word in words if word)
        if short == first_letters:
            return True
    
    # Check if short is contained in long as a substring after normalization
    short_norm = normalize_company_name(short)
    long_norm = normalize_company_name(long)
    
    if short_norm and short_norm in long_norm:
        return True
    
    return False

def calculate_similarity(name1: str, name2: str) -> float:
    """Calculate string similarity between two names."""
    # Use sequence matcher for string similarity
    return difflib.SequenceMatcher(None, name1, name2).ratio()

def calculate_token_similarity(name1: str, name2: str) -> float:
    """Calculate token-based similarity (Jaccard index)."""
    tokens1 = set(normalize_company_name(name1).split())
    tokens2 = set(normalize_company_name(name2).split())
    
    if not tokens1 or not tokens2:
        return 0.0
    
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)
    
    return len(intersection) / len(union)

# -------------------------------------------------------------------------
# Matching Functions
# -------------------------------------------------------------------------

def find_matches(fmp_companies: List[Dict[str, Any]], openfda_companies: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Find matches between FMP and OpenFDA company names."""
    print("Starting company name matching...")
    
    # Load existing aliases if any
    existing_aliases = load_aliases()
    
    # Create normalized lookup for OpenFDA companies
    openfda_lookup = {}
    for company in openfda_companies:
        name = company["company_name"]
        normalized = normalize_company_name(name)
        if normalized:  # Skip empty strings
            if normalized not in openfda_lookup:
                openfda_lookup[normalized] = []
            openfda_lookup[normalized].append(name)
    
    # Match FMP companies to OpenFDA companies
    matches = {}
    for fmp in fmp_companies:
        company_name = fmp["companyName"]
        symbol = fmp["symbol"]
        
        # Skip if already in existing aliases
        if company_name in existing_aliases:
            matches[company_name] = existing_aliases[company_name]
            continue
        
        matched_aliases = []
        match_confidences = []
        match_types = []
        
        # 1. Try exact matching after normalization
        fmp_normalized = normalize_company_name(company_name)
        if fmp_normalized in openfda_lookup:
            for alias in openfda_lookup[fmp_normalized]:
                matched_aliases.append(alias)
                match_confidences.append(MIN_EXACT_MATCH_CONFIDENCE)
                match_types.append("exact")
        
        # 2. Try abbreviation matching
        for openfda in openfda_companies:
            openfda_name = openfda["company_name"]
            
            # Skip if already matched
            if openfda_name in matched_aliases:
                continue
                
            # Check both directions
            if is_abbreviation(company_name, openfda_name) or is_abbreviation(openfda_name, company_name):
                matched_aliases.append(openfda_name)
                match_confidences.append(ABBREVIATION_MATCH_CONFIDENCE)
                match_types.append("abbreviation")
        
        # 3. Try token-based matching
        for openfda in openfda_companies:
            openfda_name = openfda["company_name"]
            
            # Skip if already matched
            if openfda_name in matched_aliases:
                continue
                
            token_similarity = calculate_token_similarity(company_name, openfda_name)
            if token_similarity >= MIN_TOKEN_MATCH_CONFIDENCE:
                matched_aliases.append(openfda_name)
                match_confidences.append(token_similarity)
                match_types.append("token")
        
        # 4. Try fuzzy string matching
        for openfda in openfda_companies:
            openfda_name = openfda["company_name"]
            
            # Skip if already matched
            if openfda_name in matched_aliases:
                continue
                
            similarity = calculate_similarity(fmp_normalized, normalize_company_name(openfda_name))
            if similarity >= MIN_FUZZY_MATCH_CONFIDENCE:
                matched_aliases.append(openfda_name)
                match_confidences.append(similarity)
                match_types.append("fuzzy")
        
        # Save matches if any found
        if matched_aliases:
            matches[company_name] = {
                "symbol": symbol,
                "aliases": matched_aliases,
                "confidences": match_confidences,
                "match_types": match_types
            }
    
    print(f"Found matches for {len(matches)} companies")
    return matches

# -------------------------------------------------------------------------
# Analysis Functions
# -------------------------------------------------------------------------

def analyze_matches(aliases: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Analyze the matches in the company aliases file."""
    if aliases is None:
        aliases = load_aliases()
    
    if not aliases:
        print("No aliases found. Make sure to run the matching algorithm first.")
        return {}
    
    # Basic statistics
    total_companies = len(aliases)
    total_aliases = sum(len(v["aliases"]) for v in aliases.values())
    avg_aliases = total_aliases / total_companies if total_companies > 0 else 0
    
    # Match type analysis
    match_types = []
    confidence_scores = []
    
    for company, data in aliases.items():
        match_types.extend(data["match_types"])
        confidence_scores.extend(data["confidences"])
    
    match_type_counts = Counter(match_types)
    
    # Confidence score analysis
    confidence_ranges = {
        "1.0": 0,
        "0.95-0.99": 0,
        "0.90-0.94": 0,
        "0.85-0.89": 0
    }
    
    for score in confidence_scores:
        if score == 1.0:
            confidence_ranges["1.0"] += 1
        elif 0.95 <= score < 1.0:
            confidence_ranges["0.95-0.99"] += 1
        elif 0.90 <= score < 0.95:
            confidence_ranges["0.90-0.94"] += 1
        elif 0.85 <= score < 0.90:
            confidence_ranges["0.85-0.89"] += 1
    
    # Find companies with most aliases
    companies_by_aliases = sorted(
        [(company, len(data["aliases"])) for company, data in aliases.items()],
        key=lambda x: x[1],
        reverse=True
    )
    
    # Print results
    print("\n--- Company Alias Matching Analysis ---")
    print(f"Total FMP companies with matches: {total_companies}")
    print(f"Total aliases found: {total_aliases}")
    print(f"Average aliases per company: {avg_aliases:.2f}")
    
    print("\nMatch type distribution:")
    for match_type, count in match_type_counts.items():
        print(f"  {match_type}: {count} ({count/len(match_types)*100:.1f}%)")
    
    print("\nConfidence score distribution:")
    for range_name, count in confidence_ranges.items():
        print(f"  {range_name}: {count} ({count/len(confidence_scores)*100:.1f}%)")
    
    print("\nTop 10 companies with most aliases:")
    for company, count in companies_by_aliases[:10]:
        print(f"  {company}: {count} aliases")
    
    # Find potential problematic matches
    problematic = []
    for company, data in aliases.items():
        if all(match_type == "fuzzy" for match_type in data["match_types"]):
            if len(data["match_types"]) > 2:  # More than 2 fuzzy matches may be suspicious
                problematic.append((company, len(data["aliases"])))
    
    if problematic:
        print("\nPotentially problematic matches (companies with only fuzzy matches):")
        for company, count in sorted(problematic, key=lambda x: x[1], reverse=True)[:10]:
            print(f"  {company}: {count} aliases (all fuzzy)")
    
    return {
        "total_companies": total_companies,
        "total_aliases": total_aliases,
        "avg_aliases": avg_aliases,
        "match_types": dict(match_type_counts),
        "confidence_ranges": confidence_ranges,
        "top_companies": companies_by_aliases[:10],
        "problematic": problematic
    }

# -------------------------------------------------------------------------
# Fix Functions
# -------------------------------------------------------------------------

def identify_problematic_matches(aliases: Dict[str, Any]) -> List[str]:
    """Identify matches that may be problematic."""
    problematic = []
    
    for company, data in aliases.items():
        # Case 1: Companies with only fuzzy matches and more than 2 aliases
        if all(match_type == "fuzzy" for match_type in data["match_types"]) and len(data["match_types"]) > 2:
            problematic.append(company)
            
        # Case 2: Companies with a very high number of aliases (potential false positives)
        if len(data["aliases"]) > 20:
            problematic.append(company)
            
        # Case 3: Companies with abbreviation matches that seem suspicious
        abbrev_count = sum(1 for match_type in data["match_types"] if match_type == "abbreviation")
        if abbrev_count > 8:
            problematic.append(company)
    
    return list(set(problematic))  # Remove duplicates

def fix_problematic_matches(aliases: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Fix problematic aliases."""
    if aliases is None:
        aliases = load_aliases()
        
    if not aliases:
        print("No aliases found. Make sure to run the matching algorithm first.")
        return {}
    
    # Find problematic matches
    auto_problematic = identify_problematic_matches(aliases)
    print(f"Auto-identified {len(auto_problematic)} problematic companies")
    
    # Combine automatic and manual fixes
    all_problematic = set(auto_problematic) | set(MANUAL_FIXES.keys())
    print(f"Total problematic companies to fix: {len(all_problematic)}")
    
    fixed_aliases = aliases.copy()
    removed_companies = []
    fixed_companies = []
    
    for company in all_problematic:
        if company not in fixed_aliases:
            continue
            
        # Apply manual fixes if available
        if company in MANUAL_FIXES:
            fix_info = MANUAL_FIXES[company]
            
            if fix_info.get("remove_all", False):
                # Remove the company entirely
                del fixed_aliases[company]
                removed_companies.append(company)
                continue
                
            if "keep" in fix_info:
                # Keep only the specified aliases
                kept_aliases = []
                kept_confidences = []
                kept_match_types = []
                
                for alias, confidence, match_type in zip(
                    fixed_aliases[company]["aliases"],
                    fixed_aliases[company]["confidences"],
                    fixed_aliases[company]["match_types"]
                ):
                    if alias in fix_info["keep"]:
                        kept_aliases.append(alias)
                        kept_confidences.append(confidence)
                        kept_match_types.append(match_type)
                
                old_count = len(fixed_aliases[company]["aliases"])
                new_count = len(kept_aliases)
                
                fixed_aliases[company]["aliases"] = kept_aliases
                fixed_aliases[company]["confidences"] = kept_confidences
                fixed_aliases[company]["match_types"] = kept_match_types
                
                # If no aliases remain, remove the company
                if not kept_aliases:
                    del fixed_aliases[company]
                    removed_companies.append(company)
                else:
                    fixed_companies.append((company, old_count, new_count))
                    
        # Otherwise, apply automatic fixes
        else:
            # For companies with only fuzzy matches, remove them
            all_fuzzy = all(match_type == "fuzzy" for match_type in fixed_aliases[company]["match_types"])
            if all_fuzzy and len(fixed_aliases[company]["match_types"]) > 2:
                del fixed_aliases[company]
                removed_companies.append(company)
    
    print(f"\nRemoved {len(removed_companies)} companies:")
    for company in removed_companies[:10]:  # Show the first 10 to avoid too much output
        print(f"  - {company}")
    if len(removed_companies) > 10:
        print(f"  ... and {len(removed_companies) - 10} more")
        
    print(f"\nFixed {len(fixed_companies)} companies by keeping only valid aliases:")
    for company, old_count, new_count in fixed_companies[:10]:
        print(f"  - {company}: {old_count} → {new_count} aliases")
    if len(fixed_companies) > 10:
        print(f"  ... and {len(fixed_companies) - 10} more")
    
    return fixed_aliases

# -------------------------------------------------------------------------
# Validation Functions
# -------------------------------------------------------------------------

def validate_coverage(aliases: Dict[str, Any], fmp_companies: List[Dict[str, Any]]) -> bool:
    """Validate the coverage of FMP companies."""
    fmp_count = len(fmp_companies)
    matched_count = len(aliases)
    coverage_pct = (matched_count / fmp_count) * 100
    
    print(f"Coverage: {matched_count}/{fmp_count} FMP companies matched ({coverage_pct:.1f}%)")
    
    if matched_count < MIN_EXPECTED_MATCHES:
        print(f"❌ WARNING: Coverage below expected minimum of {MIN_EXPECTED_MATCHES} companies")
        return False
    else:
        print(f"✅ Coverage meets minimum threshold of {MIN_EXPECTED_MATCHES} companies")
        return True

def validate_alias_uniqueness(aliases: Dict[str, Any]) -> bool:
    """Check for duplicate aliases across different companies."""
    all_aliases = []
    for company, data in aliases.items():
        all_aliases.extend(data.get("aliases", []))
    
    # Count occurrences of each alias
    counts = Counter(all_aliases)
    duplicates = {alias: count for alias, count in counts.items() if count > 1}
    
    duplicate_pct = (len(duplicates) / len(all_aliases)) * 100 if all_aliases else 0
    
    print(f"Alias uniqueness: {len(duplicates)}/{len(all_aliases)} duplicated aliases ({duplicate_pct:.1f}%)")
    
    if duplicate_pct > MAX_DUPLICATED_ALIASES:
        print(f"❌ WARNING: Duplicate aliases percentage ({duplicate_pct:.1f}%) exceeds threshold ({MAX_DUPLICATED_ALIASES}%)")
        print("Top duplicated aliases:")
        for alias, count in sorted(duplicates.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"  - '{alias}' appears {count} times")
        return False
    else:
        print(f"✅ Duplicate aliases percentage below threshold")
        return True

def validate_confidence_scores(aliases: Dict[str, Any]) -> bool:
    """Validate the confidence scores of the matches."""
    all_confidences = []
    for company, data in aliases.items():
        all_confidences.extend(data.get("confidences", []))
    
    high_confidence = sum(1 for score in all_confidences if score >= 0.95)
    high_confidence_pct = (high_confidence / len(all_confidences)) * 100 if all_confidences else 0
    
    print(f"Confidence: {high_confidence}/{len(all_confidences)} matches have confidence >= 0.95 ({high_confidence_pct:.1f}%)")
    
    if high_confidence_pct < MIN_HIGH_CONFIDENCE:
        print(f"❌ WARNING: High confidence matches percentage ({high_confidence_pct:.1f}%) below threshold ({MIN_HIGH_CONFIDENCE}%)")
        return False
    else:
        print(f"✅ High confidence matches percentage meets threshold")
        return True

def validate_match_types(aliases: Dict[str, Any]) -> bool:
    """Analyze the distribution of match types."""
    match_types = []
    for company, data in aliases.items():
        match_types.extend(data.get("match_types", []))
    
    type_counts = Counter(match_types)
    
    print("Match type distribution:")
    for match_type, count in type_counts.items():
        print(f"  - {match_type}: {count} ({(count/len(match_types))*100:.1f}%)")
    
    # Check if fuzzy matches aren't too dominant
    fuzzy_pct = (type_counts.get("fuzzy", 0) / len(match_types)) * 100 if match_types else 0
    if fuzzy_pct > 20:
        print(f"❌ WARNING: High percentage of fuzzy matches ({fuzzy_pct:.1f}%), review required")
        return False
    else:
        print(f"✅ Fuzzy match percentage acceptable")
        return True

def validate_against_source_data(aliases: Dict[str, Any], fmp_companies: List[Dict[str, Any]], openfda_companies: List[Dict[str, Any]]) -> bool:
    """Validate that aliases reference existing companies in source data."""
    # Build lookup dictionaries
    fmp_names = {company["companyName"] for company in fmp_companies}
    openfda_names = {company["company_name"] for company in openfda_companies}
    
    # Check that all FMP companies in aliases exist in FMP data
    missing_fmp = [company for company in aliases.keys() if company not in fmp_names]
    
    # Check that all aliases exist in OpenFDA data
    missing_aliases = []
    for company, data in aliases.items():
        for alias in data.get("aliases", []):
            if alias not in openfda_names:
                missing_aliases.append((company, alias))
    
    print(f"Source data validation:")
    if missing_fmp:
        print(f"❌ WARNING: {len(missing_fmp)} companies in aliases not found in FMP data")
        for company in missing_fmp[:5]:  # Show first 5
            print(f"  - '{company}'")
        valid_fmp = False
    else:
        print(f"✅ All companies in aliases exist in FMP data")
        valid_fmp = True
    
    if missing_aliases:
        print(f"❌ WARNING: {len(missing_aliases)} aliases not found in OpenFDA data")
        for company, alias in missing_aliases[:5]:  # Show first 5
            print(f"  - '{alias}' (mapped to '{company}')")
        valid_aliases = False
    else:
        print(f"✅ All aliases exist in OpenFDA data")
        valid_aliases = True
    
    return valid_fmp and valid_aliases

def validate_normalized_matches(aliases: Dict[str, Any]) -> bool:
    """Validate that normalized forms actually match with special handling for abbreviations."""
    problematic_matches = []
    
    for company, data in aliases.items():
        company_norm = normalize_company_name(company)
        company_norm = further_normalize(company_norm)
        
        for i, alias in enumerate(data.get("aliases", [])):
            alias_norm = normalize_company_name(alias)
            alias_norm = further_normalize(alias_norm)
            
            match_type = data.get("match_types", [])[i] if i < len(data.get("match_types", [])) else "unknown"
            confidence = data.get("confidences", [])[i] if i < len(data.get("confidences", [])) else 0
            
            # Skip this check for abbreviation matches, since we expect them to be different
            if match_type == "abbreviation":
                continue
                
            # Skip for stock symbols and short acronyms (less than 5 characters)
            if len(alias) < 5 and alias.isupper():
                continue
                
            # For exact matches, only flag if normalized forms are significantly different
            if match_type == "exact" and company_norm != alias_norm:
                # If it's a reasonable abbreviation (one is contained in the other), skip
                if company_norm in alias_norm or alias_norm in company_norm:
                    continue
                
                # Split into words and check if most words match
                company_words = set(company_norm.split())
                alias_words = set(alias_norm.split())
                common_words = company_words.intersection(alias_words)
                
                # If more than 50% of words match, consider it good enough
                if len(common_words) >= min(len(company_words), len(alias_words)) * 0.5:
                    continue
                    
                problematic_matches.append({
                    "company": company,
                    "alias": alias,
                    "match_type": match_type,
                    "confidence": confidence,
                    "company_norm": company_norm,
                    "alias_norm": alias_norm
                })
                
    print(f"Normalized match validation:")
    if problematic_matches:
        print(f"❌ WARNING: {len(problematic_matches)} exact matches have significantly different normalized forms")
        for match in problematic_matches[:5]:  # Show first 5
            print(f"  - '{match['company']}' -> '{match['alias']}'")
            print(f"    Normalized: '{match['company_norm']}' vs '{match['alias_norm']}'")
        
        # Only fail if there are many problematic matches
        if len(problematic_matches) > 10:
            return False
        else:
            print(f"  (Small number of discrepancies, considered acceptable)")
            return True
    else:
        print(f"✅ All matches have compatible normalized forms")
        return True

def validate_matches(aliases: Optional[Dict[str, Any]] = None) -> bool:
    """Run all validation tests on company matches."""
    if aliases is None:
        aliases = load_aliases()
        
    if not aliases:
        print("No aliases found. Make sure to run the matching algorithm first.")
        return False
    
    fmp_companies, openfda_companies = load_companies()
    
    print("===== Company Matching Validation =====\n")
    
    # Run validation tests
    results = []
    
    print("-- Coverage Test --")
    results.append(validate_coverage(aliases, fmp_companies))
    print("")
    
    print("-- Alias Uniqueness Test --")
    results.append(validate_alias_uniqueness(aliases))
    print("")
    
    print("-- Confidence Score Test --")
    results.append(validate_confidence_scores(aliases))
    print("")
    
    print("-- Match Type Distribution Test --")
    results.append(validate_match_types(aliases))
    print("")
    
    print("-- Source Data Test --")
    results.append(validate_against_source_data(aliases, fmp_companies, openfda_companies))
    print("")
    
    print("-- Normalized Match Test --")
    results.append(validate_normalized_matches(aliases))
    print("")
    
    # Overall summary
    passed = results.count(True)
    total = len(results)
    
    print(f"===== Validation Summary =====")
    print(f"Passed: {passed}/{total} tests ({(passed/total)*100:.1f}%)")
    
    if all(results):
        print("✅ All validation tests passed!")
        return True
    else:
        print("❌ Some validation tests failed. Review warnings above.")
        return False

# -------------------------------------------------------------------------
# Main Function and CLI
# -------------------------------------------------------------------------

def run_full_pipeline() -> None:
    """Run the complete company matching pipeline."""
    print("Running full company matching pipeline...\n")
    
    # Step 1: Find matches
    print("\n=== STEP 1: MATCHING ===")
    fmp_companies, openfda_companies = load_companies()
    matches = find_matches(fmp_companies, openfda_companies)
    save_aliases(matches)
    
    # Step 2: Analyze matches
    print("\n=== STEP 2: ANALYZING ===")
    analyze_matches(matches)
    
    # Step 3: Fix problematic matches
    print("\n=== STEP 3: FIXING ===")
    fixed_matches = fix_problematic_matches(matches)
    save_aliases(fixed_matches)
    
    # Step 4: Validate matches
    print("\n=== STEP 4: VALIDATING ===")
    validate_matches(fixed_matches)
    
    print("\nCompany matching pipeline complete!")

def parse_arguments() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Company Name Matcher")
    parser.add_argument(
        "--mode", 
        type=str, 
        choices=["match", "analyze", "fix", "validate", "all"], 
        default="all",
        help="Mode to run: match, analyze, fix, validate, or all (default)"
    )
    return parser.parse_args()

def main() -> None:
    """Main function."""
    args = parse_arguments()
    
    if args.mode == "all":
        run_full_pipeline()
    elif args.mode == "match":
        fmp_companies, openfda_companies = load_companies()
        matches = find_matches(fmp_companies, openfda_companies)
        save_aliases(matches)
    elif args.mode == "analyze":
        analyze_matches()
    elif args.mode == "fix":
        fixed_matches = fix_problematic_matches()
        save_aliases(fixed_matches)
    elif args.mode == "validate":
        validate_matches()

if __name__ == "__main__":
    main() 