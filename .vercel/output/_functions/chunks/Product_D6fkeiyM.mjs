function dbProductToProduct(dbProduct) {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    genericName: dbProduct.generic_name || void 0,
    companyId: dbProduct.company_id,
    description: dbProduct.description || void 0,
    status: dbProduct.status || void 0,
    stage: dbProduct.stage || void 0,
    year: dbProduct.year ? Number(dbProduct.year) : void 0,
    moleculeType: dbProduct.molecule_type || void 0,
    imageUrl: dbProduct.image_url || void 0,
    website: dbProduct.website || void 0,
    createdAt: dbProduct.created_at || void 0,
    updatedAt: dbProduct.updated_at || void 0,
    slug: dbProduct.slug,
    therapeuticAreas: [],
    // This will be populated separately by joining with product_therapeutic_areas
    indications: []
    // This will be populated separately by joining with product_indications
  };
}

export { dbProductToProduct as d };
