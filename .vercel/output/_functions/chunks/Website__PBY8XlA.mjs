function dbWebsiteToWebsite(dbWebsite) {
  return {
    id: dbWebsite.id,
    domain: dbWebsite.domain,
    siteName: dbWebsite.site_name || void 0,
    categoryId: dbWebsite.category_id || void 0,
    description: dbWebsite.description || void 0,
    companyId: dbWebsite.company_id,
    url: dbWebsite.url,
    hasSSL: dbWebsite.has_ssl || void 0,
    status: dbWebsite.status || void 0,
    screenshotUrl: dbWebsite.screenshot_url || void 0,
    screenshotDate: dbWebsite.screenshot_date || void 0,
    lastCrawl: dbWebsite.last_crawl || void 0,
    lastUpdated: dbWebsite.last_updated || void 0,
    createdAt: dbWebsite.created_at || void 0,
    updatedAt: dbWebsite.updated_at || void 0,
    slug: dbWebsite.slug,
    therapeuticAreas: []
    // This will be populated separately by joining with website_therapeutic_areas
  };
}

export { dbWebsiteToWebsite as d };
