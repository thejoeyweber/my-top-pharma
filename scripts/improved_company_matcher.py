#!/usr/bin/env python3
"""
Improved Company Name Matcher

A more accurate and reliable solution for matching company names between
Financial Modeling Prep (FMP) and OpenFDA datasets using the recordlinkage library.

This script replaces the previous matching implementation with a more robust approach
that addresses the limitations of the previous solution.

Usage:
    python improved_company_matcher.py --mode=match     # Run the matching algorithm
    python improved_company_matcher.py --mode=analyze   # Analyze matching results
    python improved_company_matcher.py --mode=validate  # Validate results
    python improved_company_matcher.py --mode=all       # Run the complete pipeline
"""

import json
import os
import re
import sys
import argparse
import logging
from typing import Dict, List, Tuple, Set, Any, Optional, Union
from collections import Counter
import pandas as pd
import numpy as np
import recordlinkage as rl
from recordlinkage.preprocessing import clean, phonetic
from recordlinkage.base import BaseCompareFeature
from recordlinkage.index import Block, SortedNeighbourhood
from recordlinkage.classifiers import ECMClassifier
import traceback
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# File paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))
TEMP_DIR = os.path.join(ROOT_DIR, '_docs', 'temp')
FMP_COMPANIES_FILE = os.path.join(TEMP_DIR, 'fmp_companies.json')
OPENFDA_COMPANIES_FILE = os.path.join(TEMP_DIR, 'openfda_companies.json')
ALIASES_FILE = os.path.join(TEMP_DIR, 'company_aliases.json')

# Match scoring thresholds (used only if not using ECM classifier)
HIGH_CONFIDENCE_THRESHOLD = 0.9    # For high confidence matches
MEDIUM_CONFIDENCE_THRESHOLD = 0.8  # Increased from 0.75 to 0.8
LOW_CONFIDENCE_THRESHOLD = 0.7     # Increased from 0.5 to 0.7

# Common pharmaceutical terms that should not be heavily weighted in matching
COMMON_PHARMA_TERMS = {
    'pharma', 'pharms', 'pharmaceutical', 'pharmaceuticals', 'pharmaco', 
    'therapeutics', 'therapeut', 'therap', 'therapy', 'biopharma', 'biopharm',
    'biologics', 'biologic', 'bio', 'biotech', 'biotechnology', 'health', 
    'healthcare', 'sciences', 'labs', 'laboratories', 'corp', 'corporation',
    'inc', 'incorporated', 'llc', 'ltd', 'limited', 'co', 'company',
    'group', 'holdings', 'medicine', 'medical', 'medica', 'med'
}

# Distinctive pharmaceutical terms that should be weighted more heavily
DISTINCTIVE_PHARMA_TERMS = {
    'oncology', 'antibody', 'genome', 'diagnostic', 'genetics', 'biologics',
    'immunology', 'vaccine', 'orphan', 'rare', 'ophthalmic', 'dermatology', 
    'neurology', 'cardio', 'vascular', 'pulmonary'
}

# Legal suffixes to standardize/remove in company names
LEGAL_SUFFIXES = {
    'inc', 'incorporated', 'corp', 'corporation', 'llc', 'ltd', 'limited',
    'co', 'company', 'group', 'holdings', 'plc', 'sa', 'ag', 'gmbh', 'bv', 'nv',
    'lp', 'l.p.', 'sas', 'spa', 'a/s', 'ab', 'asa', 'oyj', 'se', 'kk', 'biopharma',
    'pharmaceutical', 'pharmaceuticals', 'therapeutics', 'biosciences', 'sciences'
}

# Geographic designations to remove when comparing
GEO_DESIGNATIONS = {
    'us', 'usa', 'america', 'american', 'americas', 'u.s.', 'u.s.a.', 
    'uk', 'u.k.', 'canada', 'canadian', 'europe', 'european', 'japan',
    'japanese', 'china', 'chinese', 'asia', 'asian', 'international',
    'global', 'north', 'south', 'east', 'west', 'united states', 
    'australia', 'germany', 'ireland', 'france', 'india'
}

# Pharmaceutical terms to detect in company names
PHARMA_TERMS = {
    'pharma', 'pharms', 'pharmaceutical', 'pharmaceuticals', 'pharmaco', 
    'therapeutics', 'therapeutic', 'therapy', 'therapies', 'biopharma', 
    'biologics', 'bioscience', 'biosciences', 'biotech', 'biotechnology',
    'biomedical', 'medicine', 'medical', 'health', 'healthcare', 'labs',
    'laboratories', 'sciences', 'scientific', 'genetics', 'genomics',
    'oncology', 'antibody', 'antibodies', 'immunology', 'vaccine', 'vaccines',
    'orphan', 'drug', 'drugs', 'rx', 'med', 'meds', 'chem', 'biochem', 'molecular'
}

# Common company prefixes to pay special attention to
COMMON_PREFIXES = {
    'a': ['accel', 'accent', 'accept', 'access', 'accord', 'acco', 'ace', 'aceto', 'acor', 'activ', 
         'ada', 'adapt', 'adept', 'adva', 'advanz', 'adven', 'aerie', 'aero', 'aes', 'aesth', 'ag', 
         'age', 'agile', 'agri', 'ai', 'aid', 'aim', 'air', 'airo', 'aj', 'aka', 'akam', 'aki', 
         'akoya', 'alb', 'alc', 'alchem', 'ald', 'aler', 'alex', 'alf', 'alg', 'algi', 'alim', 
         'all', 'alleg', 'alli', 'allig', 'allo', 'allog', 'allo', 'alm', 'alph', 'alps', 'alt', 
         'alta', 'alter', 'altim', 'alvo', 'alx', 'aly', 'alzh', 'am', 'amb', 'amc', 'ame', 'amg', 
         'amn', 'amor', 'amp', 'ampli', 'amr', 'ams', 'an', 'ana', 'anapt', 'anc', 'angio', 'anthe', 
         'anti', 'antico', 'aon', 'ap', 'apc', 'apex', 'apog', 'apol', 'app', 'appy', 'apr', 'apt', 
         'aqu', 'ar', 'ara', 'arav', 'arc', 'arch', 'arcto', 'ard', 'are', 'aren', 'ares', 'arg', 
         'aria', 'aries', 'arm', 'armo', 'aro', 'arq', 'arr', 'arrow', 'art', 'arte', 'arth', 'arti', 
         'as', 'asc', 'aslan', 'asp', 'aspen', 'aspira', 'ast', 'astr', 'astro', 'asys', 'at', 'atea',
         'ate', 'ath', 'athen', 'ati', 'atl', 'atlas', 'atm', 'ato', 'atom', 'atr', 'atra', 'atri',
         'att', 'aug', 'aur', 'aurora', 'aus', 'aut', 'auto', 'av', 'ava', 'avant', 'ave', 'aveo',
         'avi', 'avid', 'avn', 'avo', 'axi', 'axis', 'axo', 'ay', 'az', 'aze', 'azie', 'azn', 'azur'],
    'b': ['back', 'bal', 'balc', 'bard', 'bax', 'bay', 'bb', 'bc', 'bct', 'bd', 'be', 'beam', 'bear',
         'bee', 'bel', 'belle', 'ben', 'ber', 'berg', 'berk', 'berry', 'bes', 'best', 'bet', 'beya',
         'bey', 'bg', 'bgi', 'bg', 'bi', 'bia', 'bic', 'big', 'bio', 'bioc', 'bioe', 'biog', 'biol',
         'biom', 'bion', 'biop', 'bior', 'bios', 'biot', 'biov', 'biox', 'bird', 'bis', 'bj', 'bk'],
    'c': ['cabot', 'cad', 'cal', 'calg', 'cali', 'call', 'cam', 'camb', 'can', 'canc', 'cand', 'cann',
         'cant', 'cap', 'capr', 'car', 'carb', 'card', 'care', 'carl', 'carm', 'carn', 'caro', 'cart',
         'carv', 'cas', 'casc', 'cass', 'cast', 'cat', 'cata', 'catb', 'cath', 'cav', 'cb', 'cc', 'cd',
         'ce', 'cea', 'ced', 'cel', 'cele', 'cell', 'cels', 'cen', 'cent', 'cer', 'cere', 'cern',
         'cert', 'ces', 'cf', 'cg', 'ch', 'cha', 'chal', 'cham', 'chan', 'char', 'che', 'chem', 'chen',
         'cher', 'chi', 'chill', 'chim', 'chin', 'chr', 'chro', 'ci', 'cic', 'cil', 'cin', 'cinc',
         'ciph', 'cir', 'circ', 'cis', 'cit', 'citi', 'cl', 'cla', 'clai', 'clan', 'clar', 'clas',
         'clay', 'cle', 'clea', 'clem', 'clev', 'cli', 'clin', 'clo', 'clou', 'clov', 'cm', 'cn', 'co',
         'coa', 'cohe', 'col', 'colon', 'com', 'cone', 'conn', 'cons', 'cont', 'conv', 'cor', 'cord',
         'core', 'corp', 'cos', 'cour', 'cov', 'cox', 'cp', 'cr', 'cra', 'cray', 'cre', 'creo', 'cresc',
         'cri', 'cris', 'crit', 'cro', 'crov', 'crox', 'cry', 'cryo', 'cs', 'ct', 'cu', 'cue', 'cul',
         'cult', 'cur', 'cura', 'cure', 'curi', 'curl', 'curt', 'cus', 'cut', 'cv', 'cy', 'cyb', 'cyc',
         'cycl', 'cyn', 'cys', 'cyt', 'cz']
}

# -------------------------------------------------------------------------
# Custom Comparison Features
# -------------------------------------------------------------------------

class AbbreviationSimilarity(BaseCompareFeature):
    """
    Custom comparison feature for detecting company abbreviations.
    Checks if one string could be an abbreviation of the other.
    """
    
    def __init__(self, left_on, right_on):
        super().__init__(left_on, right_on)
        # Simplify column name
        self.name = "abbreviation_similarity"
    
    def _compute_vectorized(self, left_array, right_array):
        """Compute the abbreviation similarity score."""
        return np.array([
            self._is_abbreviation(str(left), str(right)) 
            for left, right in zip(left_array, right_array)
        ])
    
    def _is_abbreviation(self, str1: str, str2: str) -> float:
        """Check if one string is a likely abbreviation of the other."""
        # Make sure we work with non-empty strings
        if not str1 or not str2:
            return 0.0
            
        # Normalize strings to lowercase
        str1 = str1.lower()
        str2 = str2.lower()
        
        # If strings are identical after normalization, not an abbreviation
        if str1 == str2:
            return 0.0
            
        # Pick the shorter string as potential abbreviation
        short, long = (str1, str2) if len(str1) < len(str2) else (str2, str1)
        
        # Case 1: Short string is all uppercase and could be acronym
        if len(short) <= 5 and (short.isupper() or not re.search(r'[aeiou]', short)):
            # Split long string into words and check first letters
            words = long.split()
            
            # First check exact acronym (match each letter with first letter of each word)
            if len(short) == len(words):
                if all(word.startswith(letter.lower()) for word, letter in zip(words, short)):
                    return 1.0
            
            # Then check if it's a partial acronym (first letters of some words)
            first_letters = ''.join(word[0] for word in words if word).upper()
            if short in first_letters:
                return 0.8
                
            # Check if short is contained in first_letters with some missing letters
            common_letters = len([c for c in short if c in first_letters])
            if common_letters >= max(2, len(short) * 0.7):
                return 0.6 * (common_letters / len(short))
        
        # Check if short is substring of long after removing spaces
        long_no_spaces = long.replace(' ', '')
        short_no_spaces = short.replace(' ', '')
        
        if short_no_spaces in long_no_spaces:
            return 0.7
            
        # Case 3: Check if short consists of fragments of long
        words = long.split()
        for word in words:
            if len(word) >= 3 and word in short:
                return 0.5
                
        return 0.0

class PharmaNameSimilarity(BaseCompareFeature):
    """
    Specialized comparison for pharmaceutical company names.
    Gives higher weight to distinctive parts of names and lower weight to common industry terms.
    """
    
    def __init__(self, left_on, right_on):
        super().__init__(left_on, right_on)
        self.name = "pharma_name_similarity"
    
    def _compute_vectorized(self, left_array, right_array):
        """Compute the pharmaceutical name similarity score."""
        return np.array([
            self._pharma_name_similarity(str(left), str(right)) 
            for left, right in zip(left_array, right_array)
        ])
    
    def _pharma_name_similarity(self, str1: str, str2: str) -> float:
        """
        Calculate similarity specific to pharmaceutical company names.
        Focuses on distinctive parts of the name, not common industry terms.
        """
        # Make sure we work with non-empty strings
        if not str1 or not str2:
            return 0.0
            
        # Normalize strings to lowercase
        str1 = str1.lower()
        str2 = str2.lower()
        
        # Split into words
        words1 = set(str1.split())
        words2 = set(str2.split())
        
        # Extract distinctive words by removing common terms
        distinctive1 = words1.difference(COMMON_PHARMA_TERMS)
        distinctive2 = words2.difference(COMMON_PHARMA_TERMS)
        
        # If either name has no distinctive terms, use original words
        if not distinctive1:
            distinctive1 = words1
        if not distinctive2:
            distinctive2 = words2
        
        # Calculate overlap of distinctive words (weighted Jaccard)
        if not distinctive1 or not distinctive2:
            return 0.0
            
        intersection = distinctive1.intersection(distinctive2)
        union = distinctive1.union(distinctive2)
        
        if not union:
            return 0.0
        
        # If we have exact match on distinctive terms, high score
        if distinctive1 == distinctive2 and len(distinctive1) > 0:
            return 1.0
            
        # Basic Jaccard similarity on distinctive terms
        basic_sim = len(intersection) / len(union)
        
        # Boost score if they share any distinctive pharma terms
        shared_distinctive = intersection.intersection(DISTINCTIVE_PHARMA_TERMS)
        if shared_distinctive:
            basic_sim = min(1.0, basic_sim + 0.2)
            
        return basic_sim

class PrefixSimilarity(BaseCompareFeature):
    """
    Custom comparison specifically for company name prefixes.
    Important for pharmaceutical companies where prefixes are often distinctive.
    """
    
    def __init__(self, left_on, right_on):
        super().__init__(left_on, right_on)
        self.name = "prefix_similarity"
    
    def _compute_vectorized(self, left_array, right_array):
        """Compute the prefix similarity score."""
        return np.array([
            self._prefix_similarity(str(left), str(right)) 
            for left, right in zip(left_array, right_array)
        ])
    
    def _prefix_similarity(self, prefix1: str, prefix2: str) -> float:
        """Calculate similarity specifically for company name prefixes."""
        # Make sure we work with non-empty strings
        if not prefix1 or not prefix2:
            return 0.0
            
        # Normalize to lowercase
        prefix1 = prefix1.lower()
        prefix2 = prefix2.lower()
        
        # Exact match gets perfect score
        if prefix1 == prefix2:
            return 1.0
        
        # If one is a prefix of the other, high score
        if prefix1.startswith(prefix2) or prefix2.startswith(prefix1):
            longer = max(len(prefix1), len(prefix2))
            shorter = min(len(prefix1), len(prefix2))
            # Higher score for closer lengths
            if shorter >= 3:  # Minimum meaningful prefix length
                return 0.9 * (shorter / longer)
        
        # Check if they share common prefixes from our list
        for prefix_list in COMMON_PREFIXES.values():
            common_prefixes = [p for p in prefix_list if prefix1.startswith(p) and prefix2.startswith(p)]
            if common_prefixes:
                longest_common = max(common_prefixes, key=len)
                # Score based on length of common prefix relative to original prefixes
                avg_len = (len(prefix1) + len(prefix2)) / 2
                return 0.8 * (len(longest_common) / avg_len)
        
        # Check for edit distance for similar but not identical prefixes
        if len(prefix1) > 2 and len(prefix2) > 2:
            # Simple edit distance calculation
            changes = sum(1 for a, b in zip(prefix1[:3], prefix2[:3]) if a != b)
            if changes <= 1:
                return 0.7
        
        return 0.0

class PhoneticSimilarity(BaseCompareFeature):
    """
    Custom comparison for phonetic similarity of company names.
    Uses already computed phonetic encodings.
    """
    
    def __init__(self, left_on, right_on):
        super().__init__(left_on, right_on)
        self.name = "phonetic_similarity"
    
    def _compute_vectorized(self, left_array, right_array):
        """Compute the phonetic similarity score."""
        return np.array([
            1.0 if str(left) == str(right) and str(left) != '' else 0.0
            for left, right in zip(left_array, right_array)
        ])

# -------------------------------------------------------------------------
# Data Loading and Preprocessing
# -------------------------------------------------------------------------

def load_companies(data_type):
    """
    Load company data from JSON files
    
    Args:
        data_type: Either 'fmp' or 'openfda'
    
    Returns:
        List of company dictionaries
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    if data_type == 'fmp':
        # Load FMP companies
        file_path = os.path.join(base_dir, '_docs', 'temp', 'fmp_companies_initial.json')
        
        with open(file_path, 'r') as f:
            companies = json.load(f)
            
        logging.info(f"Loaded {len(companies)} FMP companies from {file_path}")
        return companies
    
    elif data_type == 'openfda':
        # Load OpenFDA companies
        file_path = os.path.join(base_dir, '_docs', 'temp', 'openfda_companies.json')
        
        with open(file_path, 'r') as f:
            companies = json.load(f)
            
        logging.info(f"Loaded {len(companies)} OpenFDA companies from {file_path}")
        return companies
    
    else:
        raise ValueError(f"Unknown data_type: {data_type}")

def load_aliases() -> Dict[str, Any]:
    """Load existing company aliases."""
    try:
        with open(ALIASES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.info("No existing aliases file found. Will create a new one.")
        return {}
    except Exception as e:
        logger.error(f"Error loading aliases file: {e}")
        return {}

def save_aliases(aliases: Dict[str, Any]) -> None:
    """Save company aliases to file."""
    try:
        with open(ALIASES_FILE, 'w', encoding='utf-8') as f:
            json.dump(aliases, f, indent=2)
        logger.info(f"Saved aliases to {ALIASES_FILE}")
    except Exception as e:
        logger.error(f"Error saving aliases file: {e}")

def preprocess_company_name(name):
    """
    Preprocess company name for matching
    
    Args:
        name: Company name string
        
    Returns:
        Preprocessed name string
    """
    if not isinstance(name, str) or not name:
        return ""
    
    # Remove leading/trailing whitespace
    name = name.strip()
    
    # Convert to lowercase
    name = name.lower()
    
    # Replace common company identifiers
    replacements = {
        ', inc.': '',
        ', inc': '',
        ' inc.': '',
        ' inc': '',
        ', llc': '',
        ' llc': '',
        ', corp.': '',
        ' corp.': '',
        ', corp': '',
        ' corp': '',
        ', ltd.': '',
        ' ltd.': '',
        ', ltd': '',
        ' ltd': '',
        ', plc': '',
        ' plc': '',
        ', co.': '',
        ' co.': '',
        ', llp': '',
        ' llp': '',
        'corporation': '',
        'incorporated': '',
        'company': '',
        'limited': ''
    }
    
    for old, new in replacements.items():
        name = name.replace(old, new)
    
    # Remove non-alphanumeric characters except spaces
    name = re.sub(r'[^\w\s]', ' ', name)
    
    # Remove extra whitespace
    name = re.sub(r'\s+', ' ', name).strip()
    
    return name

def standardize_company_name(name):
    """
    Standardize company name by removing common words
    
    Args:
        name: Preprocessed company name
        
    Returns:
        Standardized name
    """
    if not name:
        return ""
    
    # Remove common terms that don't help with matching
    common_terms = [
        'pharmaceutical', 'pharmaceuticals', 'pharma',
        'therapeutic', 'therapeutics', 'therap',
        'bioscience', 'biosciences', 'bio',
        'laboratory', 'laboratories', 'lab', 'labs',
        'medicine', 'medical', 'med',
        'health', 'healthcare', 'science', 'sciences',
        'technology', 'technologies', 'tech',
        'genetic', 'genetics', 'gene',
        'international', 'intl', 'global', 'holding',
        'america', 'american', 'usa', 'us', 'group'
    ]
    
    words = name.split()
    filtered_words = [word for word in words if word.lower() not in common_terms]
    
    # If removing common terms leaves nothing, return original name
    if not filtered_words:
        return name
    
    return ' '.join(filtered_words)

def get_company_identifier(name: str) -> str:
    """Extract a unique identifier from company name by removing common pharmaceutical terms."""
    if not name:
        return ""
        
    # Convert to lowercase
    name = name.lower()
    
    # Remove punctuation
    name = re.sub(r'[^\w\s]', ' ', name)
    
    # Remove common pharma terms, legal suffixes and geographic designations
    name_words = name.split()
    name_words = [word for word in name_words if word not in COMMON_PHARMA_TERMS 
                 and word not in LEGAL_SUFFIXES and word not in GEO_DESIGNATIONS]
    
    # Remove single letters (often not meaningful)
    name_words = [word for word in name_words if len(word) > 1]
    
    # Rejoin or return empty string if no words left
    return ' '.join(name_words).strip() if name_words else ""

def split_prefix_suffix(name: str) -> Tuple[str, str]:
    """Split a company name into prefix and suffix for better matching."""
    words = name.split()
    if len(words) <= 1:
        return name, ""
    
    # Consider first word as prefix, rest as suffix
    return words[0], ' '.join(words[1:])

def convert_to_dataframe(companies: List[Dict[str, Any]], source: str) -> pd.DataFrame:
    """Convert list of companies to a DataFrame with preprocessed names."""
    if source.lower() == 'fmp':
        df = pd.DataFrame([
            {
                'index': i,
                'original_name': company['companyName'],
                'symbol': company.get('symbol', ''),
                'clean_name': preprocess_company_name(company['companyName'])
            }
            for i, company in enumerate(companies)
        ])
    else:  # openfda
        df = pd.DataFrame([
            {
                'index': i,
                'original_name': company['company_name'],
                'product_count': company.get('product_count', 0),
                'clean_name': preprocess_company_name(company['company_name'])
            }
            for i, company in enumerate(companies)
        ])
    
    # Create standardized column using recordlinkage's clean function
    df['standardized_name'] = clean(df['original_name'])
    
    # Add phonetic encodings using multiple methods
    df['name_soundex'] = phonetic(df['clean_name'], method='soundex')
    df['name_nysiis'] = phonetic(df['clean_name'], method='nysiis')
    
    # Extract company identifier (without common terms)
    df['company_identifier'] = df['clean_name'].apply(get_company_identifier)
    
    # Split names into prefix and suffix
    prefix_suffix = df['clean_name'].apply(split_prefix_suffix)
    df['name_prefix'] = [item[0] for item in prefix_suffix]
    df['name_suffix'] = [item[1] for item in prefix_suffix]
    
    # Set index to a unique identifier
    df.set_index('index', inplace=True)
    
    return df

# -------------------------------------------------------------------------
# Matching Functions
# -------------------------------------------------------------------------

def create_blocking_pairs(df_a, df_b):
    """
    Create candidate pairs through blocking to reduce comparison space
    
    Args:
        df_a: DataFrame with FMP companies
        df_b: DataFrame with OpenFDA companies
        
    Returns:
        Candidate pairs for comparison
    """
    logging.info("Creating candidate pairs through blocking")
    
    # Initialize indexer
    indexer = rl.Index()
    
    # Block on the first character of clean_name
    indexer.block(left_on='clean_name', right_on='clean_name', block_by=lambda x: x[0] if x else '')
    
    # Use sorted neighborhood on standardized_name
    sn_indexer = rl.SortedNeighbourhood(window=3)
    indexer.add(sn_indexer.index(left_on='standardized_name', right_on='standardized_name'))
    
    # Generate candidate pairs
    candidate_pairs = indexer.index(df_a, df_b)
    
    logging.info(f"Created {len(candidate_pairs)} candidate pairs")
    
    return candidate_pairs

def compare_pairs(candidate_pairs, df_a, df_b):
    """
    Compare candidate pairs using multiple similarity measures
    
    Args:
        candidate_pairs: Candidate pairs from blocking
        df_a: DataFrame with FMP companies
        df_b: DataFrame with OpenFDA companies
        
    Returns:
        Comparison vectors with similarity scores
    """
    logging.info("Comparing candidate pairs")
    
    # Initialize comparison object
    compare = rl.Compare()
    
    # Add comparison functions
    
    # Exact string matching on original name
    compare.exact('original_name', 'original_name', label='exact_match')
    
    # String similarity on clean names
    compare.string('clean_name', 'clean_name', method='jaro_winkler', label='jw_clean_name')
    compare.string('clean_name', 'clean_name', method='levenshtein', label='lev_clean_name')
    
    # String similarity on standardized names
    compare.string('standardized_name', 'standardized_name', method='jaro_winkler', label='jw_std_name')
    compare.string('standardized_name', 'standardized_name', method='levenshtein', label='lev_std_name')
    
    # Generate comparison vectors
    comparison_vectors = compare.compute(candidate_pairs, df_a, df_b)
    
    logging.info(f"Generated comparison vectors with {len(comparison_vectors.columns)} features")
    
    return comparison_vectors

def score_matches(comparison_vectors, df_a, df_b):
    """
    Calculate match scores based on comparison vectors
    
    Args:
        comparison_vectors: Comparison vectors with similarity scores
        df_a: DataFrame with FMP companies
        df_b: DataFrame with OpenFDA companies
        
    Returns:
        DataFrame with matches and scores
    """
    logging.info("Scoring potential matches")
    
    # Define threshold for matches
    MATCH_THRESHOLD = 0.80
    
    # Calculate overall score as weighted average
    weights = {
        'exact_match': 0.4,
        'jw_clean_name': 0.25,
        'lev_clean_name': 0.1,
        'jw_std_name': 0.15,
        'lev_std_name': 0.1
    }
    
    # Ensure all expected columns exist
    for col in weights.keys():
        if col not in comparison_vectors.columns:
            comparison_vectors[col] = 0.0
    
    # Calculate weighted score
    comparison_vectors['score'] = sum(comparison_vectors[col] * weight 
                                     for col, weight in weights.items())
    
    # Filter to matches above threshold
    matches = comparison_vectors[comparison_vectors['score'] >= MATCH_THRESHOLD].copy()
    
    # Add company names for clarity
    matches['fmp_idx'] = matches.index.get_level_values(0)
    matches['openfda_idx'] = matches.index.get_level_values(1)
    
    # Add company names from original DataFrames
    matches['fmp_name'] = matches['fmp_idx'].apply(lambda idx: df_a.iloc[idx]['original_name'] if idx < len(df_a) else "Unknown")
    matches['openfda_name'] = matches['openfda_idx'].apply(lambda idx: df_b.iloc[idx]['original_name'] if idx < len(df_b) else "Unknown")
    matches['product_count'] = matches['openfda_idx'].apply(lambda idx: df_b.iloc[idx].get('product_count', 0) if idx < len(df_b) else 0)
    
    # Determine match type
    def determine_match_type(row):
        if row['exact_match'] == 1.0:
            return 'exact'
        elif row['score'] >= 0.95:
            return 'very_high'
        elif row['score'] >= 0.90:
            return 'high'
        elif row['score'] >= 0.85:
            return 'moderate'
        else:
            return 'low'
    
    matches['match_type'] = matches.apply(determine_match_type, axis=1)
    
    # Sort by score descending
    matches = matches.sort_values('score', ascending=False)
    
    logging.info(f"Found {len(matches)} matches above threshold {MATCH_THRESHOLD}")
    
    return matches

def create_matches_dict(matches, df_a, df_b):
    """
    Convert matches DataFrame to the expected output dictionary format
    
    Args:
        matches: DataFrame with matches and scores
        df_a: DataFrame with FMP companies
        df_b: DataFrame with OpenFDA companies
        
    Returns:
        Dictionary of matches with FMP company name as key
    """
    logging.info("Creating matches dictionary")
    
    matches_dict = {}
    
    # Group by FMP company index
    grouped = matches.groupby('fmp_idx')
    
    for fmp_idx, group in grouped:
        # Get FMP company name
        fmp_name = df_a.iloc[fmp_idx]['original_name'] if fmp_idx < len(df_a) else "Unknown"
        
        # Get all matching OpenFDA companies
        aliases = []
        confidence_scores = []
        match_types = []
        
        for _, row in group.iterrows():
            aliases.append(row['openfda_name'])
            confidence_scores.append(float(row['score']))
            match_types.append(row['match_type'])
        
        # Add to matches dictionary
        matches_dict[fmp_name] = {
            "aliases": aliases,
            "confidence": confidence_scores,
            "match_type": match_types
        }
    
    logging.info(f"Created matches dictionary with {len(matches_dict)} entries")
    
    return matches_dict

def find_matches(fmp_companies, openfda_companies):
    """
    Find matches between FMP and OpenFDA companies using record linkage
    
    Args:
        fmp_companies: List of FMP company dictionaries
        openfda_companies: List of OpenFDA company dictionaries
        
    Returns:
        Dictionary of matches with the FMP company name as the key
    """
    logging.info("Preparing company data for matching")
    
    # Create pandas DataFrames
    fmp_df = pd.DataFrame(fmp_companies)
    fmp_df['original_name'] = fmp_df['name']
    fmp_df['clean_name'] = fmp_df['name'].apply(preprocess_company_name)
    fmp_df['standardized_name'] = fmp_df['clean_name'].apply(standardize_company_name)
    fmp_df['index'] = fmp_df.index
    
    # Prepare OpenFDA data
    openfda_df = pd.DataFrame()
    for company in openfda_companies:
        if not isinstance(company, dict):
            continue
        
        company_name = company.get('name', '')
        product_count = company.get('products', 0)
        
        if not company_name:
            continue
            
        row = {
            'name': company_name,
            'original_name': company_name,
            'clean_name': preprocess_company_name(company_name),
            'standardized_name': standardize_company_name(preprocess_company_name(company_name)),
            'product_count': product_count
        }
        openfda_df = pd.concat([openfda_df, pd.DataFrame([row])], ignore_index=True)
    
    # Create blocking pairs to reduce comparison space
    candidate_pairs = create_blocking_pairs(fmp_df, openfda_df)
    
    # Compare candidate pairs
    comparison_vectors = compare_pairs(candidate_pairs, fmp_df, openfda_df)
    
    # Calculate match scores
    matches = score_matches(comparison_vectors, fmp_df, openfda_df)
    
    # Convert to the format needed for output
    matches_dict = create_matches_dict(matches, fmp_df, openfda_df)
    
    return matches_dict

# -------------------------------------------------------------------------
# Analysis Functions
# -------------------------------------------------------------------------

def analyze_matches(aliases: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Analyze the matches in the company aliases file."""
    if aliases is None:
        aliases = load_aliases()
    
    if not aliases:
        logger.error("No aliases found. Run the matching algorithm first.")
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
        "0.9-1.0": 0,  # High confidence
        "0.75-0.89": 0,  # Medium confidence
        "0.5-0.74": 0,  # Low confidence
        "<0.5": 0  # Very low confidence (should be rare)
    }
    
    for score in confidence_scores:
        if 0.9 <= score <= 1.0:
            confidence_ranges["0.9-1.0"] += 1
        elif 0.75 <= score < 0.9:
            confidence_ranges["0.75-0.89"] += 1
        elif 0.5 <= score < 0.75:
            confidence_ranges["0.5-0.74"] += 1
        else:
            confidence_ranges["<0.5"] += 1
    
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
    
    return {
        "total_companies": total_companies,
        "total_aliases": total_aliases,
        "avg_aliases": avg_aliases,
        "match_types": dict(match_type_counts),
        "confidence_ranges": confidence_ranges,
        "top_companies": companies_by_aliases[:10]
    }

# -------------------------------------------------------------------------
# Validation Functions
# -------------------------------------------------------------------------

def validate_matches():
    """
    Validate the quality of company matches by analyzing results
    """
    logging.info("Validating company matches")
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    matches_file = os.path.join(base_dir, '_docs', 'temp', 'improved_company_aliases.json')
    
    try:
        with open(matches_file, 'r') as f:
            matches = json.load(f)
            
        # Calculate overall statistics
        total_companies = len(matches)
        total_aliases = sum(len(data['aliases']) for company, data in matches.items())
        avg_aliases_per_company = total_aliases / total_companies if total_companies > 0 else 0
        
        # Count match types
        match_types = {}
        for company, data in matches.items():
            for match_type in data['match_type']:
                match_types[match_type] = match_types.get(match_type, 0) + 1
        
        # Find companies with most aliases
        companies_by_alias_count = sorted(
            [(company, len(data['aliases'])) for company, data in matches.items()],
            key=lambda x: x[1],
            reverse=True
        )
        
        # Print validation results
        print("\nValidation Results:")
        print(f"Total matched companies: {total_companies}")
        print(f"Total aliases: {total_aliases}")
        print(f"Average aliases per company: {avg_aliases_per_company:.2f}")
        
        print("\nMatch types:")
        for match_type, count in match_types.items():
            print(f"  - {match_type}: {count}")
        
        print("\nTop 10 companies by alias count:")
        for company, count in companies_by_alias_count[:10]:
            print(f"  - {company}: {count} aliases")
        
        # Check for potential issues
        print("\nPotential issues:")
        
        # 1. Check for companies with no aliases
        companies_no_aliases = [company for company, data in matches.items() if not data['aliases']]
        if companies_no_aliases:
            print(f"  - Found {len(companies_no_aliases)} companies with no aliases")
            if len(companies_no_aliases) <= 5:
                for company in companies_no_aliases:
                    print(f"    - {company}")
        else:
            print("  - No companies without aliases")
        
        # 2. Check for shared aliases across multiple companies
        alias_to_companies = {}
        for company, data in matches.items():
            for alias in data['aliases']:
                if alias not in alias_to_companies:
                    alias_to_companies[alias] = []
                alias_to_companies[alias].append(company)
        
        shared_aliases = {alias: companies for alias, companies in alias_to_companies.items() if len(companies) > 1}
        if shared_aliases:
            print(f"  - Found {len(shared_aliases)} aliases shared across multiple companies")
            for i, (alias, companies) in enumerate(shared_aliases.items()):
                if i < 5:  # Show only first 5 examples
                    print(f"    - {alias} is shared by: {', '.join(companies)}")
                else:
                    print(f"    - ... and {len(shared_aliases) - 5} more")
                    break
        else:
            print("  - No shared aliases found")
        
        # 3. Check for special case matches
        special_case_count = sum(1 for company, data in matches.items() if 'special_case' in data.get('match_type', []))
        print(f"  - Found {special_case_count} special case matches")
        
        logging.info("Validation completed successfully")
        return True
        
    except Exception as e:
        logging.error(f"Error validating matches: {e}")
        print(f"Error validating matches: {e}")
        return False

# -------------------------------------------------------------------------
# Main Execution Functions
# -------------------------------------------------------------------------

def run_pipeline() -> None:
    """Run the complete company matching pipeline."""
    logger.info("Running improved company matching pipeline...")
    
    # Step 1: Find matches
    matches = find_matches()
    save_aliases(matches)
    
    # Step 2: Analyze matches
    analyze_matches(matches)
    
    # Step 3: Validate matches
    validate_matches()
    
    logger.info("Company matching pipeline complete!")

def parse_arguments() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Improved Company Name Matcher")
    parser.add_argument(
        "--mode", 
        type=str, 
        choices=["match", "analyze", "validate", "all"], 
        default="all",
        help="Mode to run: match, analyze, validate, or all (default)"
    )
    return parser.parse_args()

def main() -> None:
    """Main function to run the company matching process."""
    parser = argparse.ArgumentParser(description="Improved FMP to OpenFDA company matcher")
    parser.add_argument("--mode", choices=["match", "validate"], 
                       default="match", help="Mode: match or validate")
    args = parser.parse_args()
    
    setup_logging()
    
    try:
        logging.info("Loading FMP companies")
        fmp_companies = load_companies('fmp')
        
        logging.info("Loading OpenFDA companies")
        openfda_companies = load_companies('openfda')
        
        if args.mode == "match":
            logging.info("Finding matches between FMP and OpenFDA companies")
            matches = find_matches(fmp_companies, openfda_companies)
            
            # Add special case matches for important companies not in OpenFDA data
            logging.info("Adding special case matches for important companies")
            matches = add_missing_companies(matches, fmp_companies)
            
            save_matches(matches)
            
            matched_count = len(matches)
            total_count = len(fmp_companies)
            match_rate = (matched_count / total_count) * 100 if total_count > 0 else 0
            
            logging.info(f"Matched {matched_count} out of {total_count} companies ({match_rate:.2f}%)")
            print(f"Matched {matched_count} out of {total_count} companies ({match_rate:.2f}%)")
            
        elif args.mode == "validate":
            logging.info("Validating company matching results")
            validate_matches()
            
    except Exception as e:
        logging.error(f"Error in main: {e}")
        logging.error(traceback.format_exc())
        raise

def add_missing_companies(matches_dict, fmp_companies):
    """
    Add special case matches for important companies not found in OpenFDA data,
    such as COVID-19 vaccine manufacturers and other notable pharma companies.
    
    Args:
        matches_dict: Dictionary of matches generated so far
        fmp_companies: List of FMP companies
        
    Returns:
        Updated matches_dict with special case matches added
    """
    # Companies with special handling needed
    special_cases = {
        "Moderna, Inc.": {
            "aliases": ["Moderna", "ModernaTX", "Moderna Therapeutics", "Spikevax"],
            "confidence": 1.0,
            "match_type": "special_case",
            "reason": "COVID-19 vaccine manufacturer; added manually due to EUA status"
        },
        "BioNTech SE": {
            "aliases": ["BioNTech", "Comirnaty", "BioNTech Pharmaceuticals"],
            "confidence": 1.0,
            "match_type": "special_case",
            "reason": "COVID-19 vaccine manufacturer; added manually due to EUA status"
        },
        "Johnson & Johnson": {
            "aliases": ["Janssen Biotech", "Janssen Pharmaceuticals", "Janssen Products LP", "J&J", "Janssen"],
            "confidence": 1.0,
            "match_type": "special_case",
            "reason": "Parent company of Janssen subsidiaries in OpenFDA data"
        },
        "ADMA Biologics, Inc.": {
            "aliases": ["ADMA", "ADMA Bio"],
            "confidence": 1.0,
            "match_type": "special_case",
            "reason": "Biologics manufacturer; not represented in current OpenFDA data"
        },
        "Adaptive Biotechnologies Corporation": {
            "aliases": ["Adaptive Biotechnologies", "Adaptive"],
            "confidence": 1.0,
            "match_type": "special_case",
            "reason": "Biotechnology company; not represented in current OpenFDA data"
        },
        "Arrowhead Pharmaceuticals, Inc.": {
            "aliases": ["Arrowhead", "Arrowhead Pharma"],
            "confidence": 1.0,
            "match_type": "special_case",
            "reason": "Research-stage company; not represented in current OpenFDA data"
        },
        "Beam Therapeutics Inc.": {
            "aliases": ["Beam", "Beam Therapeutics"],
            "confidence": 1.0,
            "match_type": "special_case",
            "reason": "Genome editing company; not represented in current OpenFDA data"
        },
        "Zoetis Inc.": {
            "aliases": ["Zoetis", "Zoetis Inc"],
            "confidence": 1.0,
            "match_type": "special_case",
            "reason": "Animal health company; not in human drug OpenFDA data"
        }
    }
    
    # Add special cases to matches_dict if the FMP company exists
    for fmp_company in fmp_companies:
        company_name = fmp_company["name"]
        if company_name in special_cases and company_name not in matches_dict:
            matches_dict[company_name] = special_cases[company_name]
            logging.info(f"Added special case match for {company_name}")
    
    return matches_dict

def setup_logging():
    """Set up logging configuration."""
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
                          '_docs', 'temp', 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    log_file = os.path.join(log_dir, f'company_matcher_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log')
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    
    logging.info(f"Logging to {log_file}")

def save_matches(matches):
    """Save the matches dictionary to a JSON file."""
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
                              '_docs', 'temp')
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'improved_company_aliases.json')
    
    with open(output_file, 'w') as f:
        json.dump(matches, f, indent=2)
    
    logging.info(f"Saved matches to {output_file}")
    print(f"Saved matches to {output_file}")
    
    return output_file

if __name__ == "__main__":
    main() 