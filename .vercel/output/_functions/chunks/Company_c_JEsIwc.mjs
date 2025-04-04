function dbCompanyToCompany(dbCompany) {
  return {
    id: dbCompany.id,
    name: dbCompany.name,
    description: dbCompany.description || void 0,
    logoUrl: dbCompany.logo_url || void 0,
    headerImageUrl: dbCompany.header_image_url || void 0,
    headquarters: dbCompany.headquarters || void 0,
    founded: dbCompany.founded ? String(dbCompany.founded) : void 0,
    website: dbCompany.website || void 0,
    marketCap: dbCompany.market_cap ? typeof dbCompany.market_cap === "string" ? parseFloat(dbCompany.market_cap) : dbCompany.market_cap : void 0,
    employees: dbCompany.employees || void 0,
    tickerSymbol: dbCompany.ticker_symbol || void 0,
    stockExchange: dbCompany.stock_exchange || void 0,
    ownershipType: dbCompany.ownership_type || void 0,
    parentCompanyId: dbCompany.parent_company_id || void 0,
    createdAt: dbCompany.created_at || void 0,
    updatedAt: dbCompany.updated_at || void 0,
    slug: dbCompany.slug || "",
    therapeuticAreas: []
    // This will be populated separately by joining with company_therapeutic_areas
  };
}

export { dbCompanyToCompany as d };
