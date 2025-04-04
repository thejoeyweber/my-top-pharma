#!/usr/bin/env python
"""
Analyze top companies coverage in the OpenFDA dataset.
This script compares the companies in fmp_companies_initial.json (top market cap companies)
with the matches found in company_aliases.json.
"""

import json
import os
import sys
from pathlib import Path

# Set paths
base_dir = Path(__file__).resolve().parent.parent.parent
fmp_initial_path = base_dir / "_docs" / "temp" / "fmp_companies_initial.json"
aliases_path = base_dir / "_docs" / "temp" / "company_aliases.json"

# Hardcoded top companies (as a fallback)
TOP_COMPANIES = [
    "argenx SE", "Zoetis Inc.", "Xenon Pharmaceuticals Inc.", "Viridian Therapeutics, Inc.",
    "Viking Therapeutics, Inc.", "Viatris Inc.", "Verona Pharma plc", "Vericel Corporation",
    "Vera Therapeutics, Inc.", "VectivBio Holding AG", "Vaxcyte, Inc.", 
    "United Therapeutics Corporation", "Ultragenyx Pharmaceutical Inc.", "Travere Therapeutics, Inc.",
    "Tarsus Pharmaceuticals, Inc.", "Takeda Pharmaceutical Company Limited", 
    "Syndax Pharmaceuticals, Inc.", "Summit Therapeutics Inc.", "Spyre Therapeutics, Inc.",
    "Scholar Rock Holding Corporation", "Sarepta Therapeutics, Inc.", "Sanofi",
    "Royalty Pharma plc", "Roivant Sciences Ltd.", "Rhythm Pharmaceuticals, Inc.",
    "Revolution Medicines, Inc.", "Regeneron Pharmaceuticals, Inc.", "Provention Bio, Inc.",
    "Pfizer Inc.", "Perrigo Company plc", "Pacira BioSciences, Inc.", "PTC Therapeutics, Inc.",
    "POINT Biopharma Global Inc.", "Organon & Co.", "Ocular Therapeutix, Inc.",
    "Novo Nordisk A/S", "Novavax, Inc.", "MoonLake Immunotherapeutics", "Moderna, Inc.",
    "Mirum Pharmaceuticals, Inc.", "Merus N.V.", "MannKind Corporation", 
    "Longboard Pharmaceuticals, Inc.", "Liquidia Corporation", "Ligand Pharmaceuticals Incorporated",
    "Legend Biotech Corporation", "Lantheus Holdings, Inc.", "Krystal Biotech, Inc.",
    "Kiniksa Pharmaceuticals, Ltd.", "Johnson & Johnson", "Janux Therapeutics, Inc.",
    "Iovance Biotherapeutics, Inc.", "Ionis Pharmaceuticals, Inc.", "Intra-Cellular Therapies, Inc.",
    "Innoviva, Inc.", "Indivior PLC", "Incyte Corporation", "Immunovant, Inc.",
    "Immunocore Holdings plc", "ImmunoGen, Inc.", "ImmunityBio, Inc.", "IVERIC bio, Inc.",
    "Halozyme Therapeutics, Inc.", "Grifols, S.A.", "Gilead Sciences, Inc.", "Geron Corporation",
    "Genmab A/S", "GSK plc", "Fusion Pharmaceuticals Inc.", "Exelixis, Inc.", "Evotec SE",
    "Enliven Therapeutics, Inc.", "Eli Lilly and Company", "EQRx, Inc.", 
    "Dynavax Technologies Corporation", "Dr. Reddy's Laboratories Limited", "Disc Medicine, Inc.",
    "Denali Therapeutics Inc.", "Deciphera Pharmaceuticals, Inc.", "DICE Therapeutics, Inc.",
    "Cytokinetics, Incorporated", "Crinetics Pharmaceuticals, Inc.", "Corcept Therapeutics Incorporated",
    "CinCor Pharma, Inc.", "Chinook Therapeutics, Inc.", "Cerevel Therapeutics Holdings, Inc.",
    "Centessa Pharmaceuticals plc", "Celldex Therapeutics, Inc.", "Catalent, Inc.",
    "CTI BioPharma Corp.", "CRISPR Therapeutics AG", "CG Oncology, Inc. Common stock",
    "BridgeBio Pharma, Inc.", "Blueprint Medicines Corporation", 
    "BlackRock Technology and Private Equity Term Trust", "BioNTech SE", "Bio-Techne Corporation",
    "Belite Bio, Inc", "BeiGene, Ltd.", "Beam Therapeutics Inc.", "BELLUS Health Inc.",
    "Axsome Therapeutics, Inc.", "Avidity Biosciences, Inc.", "Aurinia Pharmaceuticals Inc.",
    "AstraZeneca PLC", "Arrowhead Pharmaceuticals, Inc.", "Arcutis Biotherapeutics, Inc.",
    "Arcellx, Inc.", "Apellis Pharmaceuticals, Inc.", "Amneal Pharmaceuticals, Inc.",
    "Amicus Therapeutics, Inc.", "Amgen Inc.", "Ambrx Biopharma Inc.", "Alvotech",
    "Alnylam Pharmaceuticals, Inc.", "Alkermes plc", "Akero Therapeutics, Inc.",
    "Agios Pharmaceuticals, Inc.", "Adaptive Biotechnologies Corporation", "AbbVie Inc.",
    "ANI Pharmaceuticals, Inc.", "ADMA Biologics, Inc.", "ACADIA Pharmaceuticals Inc."
]

def main():
    """Compare top companies with matched companies."""
    initial_companies = []
    top_companies = []
    
    # Try to load initial companies file
    try:
        with open(fmp_initial_path, 'r') as f:
            initial_content = f.read()
            if initial_content.strip():  # Check if file is not empty
                print(f"Initial file size: {len(initial_content)} bytes")
                initial_companies = json.loads(initial_content)
                top_companies = [company["name"] for company in initial_companies]
                print(f"Successfully parsed initial companies from file. Count: {len(top_companies)}")
            else:
                print("Initial file is empty, using hardcoded data.")
                top_companies = TOP_COMPANIES
                print(f"Using {len(top_companies)} hardcoded companies.")
    except Exception as e:
        print(f"Error loading initial companies file: {e}")
        print("Using hardcoded company list instead.")
        top_companies = TOP_COMPANIES
        print(f"Using {len(top_companies)} hardcoded companies.")
    
    # Load aliases file
    try:
        with open(aliases_path, 'r') as f:
            aliases_content = f.read()
            print(f"Aliases file size: {len(aliases_content)} bytes")
            aliases = json.loads(aliases_content)
            print(f"Successfully parsed aliases. Count: {len(aliases)}")
    except Exception as e:
        print(f"Error loading aliases: {e}")
        return
    
    # Find matches
    matched = []
    unmatched = []
    
    for company_name in top_companies:
        if company_name in aliases:
            alias_count = len(aliases[company_name]["aliases"])
            confidence = max(aliases[company_name]["confidences"]) if aliases[company_name]["confidences"] else 0
            matched.append((company_name, alias_count, confidence))
        else:
            unmatched.append(company_name)
    
    # Output results
    print(f"\n=== Top Companies Coverage Analysis ===")
    print(f"Total top companies: {len(top_companies)}")
    print(f"Companies with matches: {len(matched)} ({len(matched)/len(top_companies)*100:.1f}%)")
    print(f"Companies without matches: {len(unmatched)} ({len(unmatched)/len(top_companies)*100:.1f}%)")
    
    print("\n=== Matched Companies ===")
    for company, alias_count, confidence in sorted(matched, key=lambda x: x[1], reverse=True):
        print(f"- {company}: {alias_count} aliases, max confidence: {confidence:.2f}")
    
    print("\n=== Top 10 Unmatched Companies ===")
    for company in sorted(unmatched)[:10]:
        print(f"- {company}")
    
    if len(unmatched) > 10:
        print(f"... and {len(unmatched) - 10} more unmatched companies")

if __name__ == "__main__":
    main() 