import { c as createComponent, a as createAstro, r as renderComponent, f as renderScript, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../../chunks/Button_D9GGRmJN.mjs';
import { $ as $$TabGroup } from '../../chunks/TabGroup_DOfUeJDy.mjs';
import { s as supabase } from '../../chunks/supabase_C3b6n6m6.mjs';
import { d as dbWebsiteToWebsite } from '../../chunks/Website__PBY8XlA.mjs';
import { d as dbCompanyToCompany } from '../../chunks/Company_c_JEsIwc.mjs';
import { d as dbProductToProduct } from '../../chunks/Product_D6fkeiyM.mjs';
import { d as dbTherapeuticAreaToTherapeuticArea } from '../../chunks/TherapeuticArea_BVI-zbe5.mjs';
import { a as getWebsiteScreenshotUrl } from '../../chunks/assetUtils_P7u5uQke.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  const { data: websites } = await supabase.from("websites").select("id, slug, domain");
  if (!websites || websites.length === 0) {
    return [];
  }
  return websites.map((website) => {
    const slugParam = website.slug || getDomainSlug(website.domain);
    return {
      params: { slug: slugParam },
      props: { websiteId: website.id }
    };
  });
}
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { websiteId } = Astro2.props;
  let websiteResponse;
  if (websiteId) {
    websiteResponse = await supabase.from("websites").select("*").eq("id", websiteId).single();
  }
  if (!websiteResponse || websiteResponse.error || !websiteResponse.data) {
    websiteResponse = await supabase.from("websites").select("*").eq("slug", slug).single();
    if (!websiteResponse || websiteResponse.error || !websiteResponse.data) {
      websiteResponse = await supabase.from("websites").select("*").eq("id", slug).single();
    }
  }
  const { data: dbWebsite, error: websiteError } = websiteResponse || {};
  if (websiteError || !dbWebsite) {
    return Astro2.redirect("/websites");
  }
  const website = dbWebsiteToWebsite(dbWebsite);
  const { data: dbCompany } = await supabase.from("companies").select("*").eq("id", website.companyId).single();
  const company = dbCompany ? dbCompanyToCompany(dbCompany) : null;
  const { data: websiteProductRelations } = await supabase.from("product_websites").select("product_id").eq("website_id", website.id);
  const productIds = (websiteProductRelations || []).map((rel) => rel.product_id);
  let associatedProducts = [];
  if (productIds.length > 0) {
    const { data: dbProducts } = await supabase.from("products").select("*").in("id", productIds);
    associatedProducts = (dbProducts || []).map(dbProductToProduct);
  }
  const { data: companyTARelations } = await supabase.from("company_therapeutic_areas").select("therapeutic_area_id").eq("company_id", website.companyId);
  const therapeuticAreaIds = (companyTARelations || []).map((rel) => rel.therapeutic_area_id);
  let therapeuticAreas = [];
  if (therapeuticAreaIds.length > 0) {
    const { data: dbTherapeuticAreas } = await supabase.from("therapeutic_areas").select("*").in("id", therapeuticAreaIds);
    therapeuticAreas = (dbTherapeuticAreas || []).map(dbTherapeuticAreaToTherapeuticArea);
  }
  const { data: similarWebsites } = await supabase.from("websites").select("*").eq("company_id", website.companyId).eq("category", website.category).neq("id", website.id).limit(5);
  const relatedWebsites = (similarWebsites || []).map(dbWebsiteToWebsite);
  const websiteCategories = [
    { value: "corporate", label: "Corporate" },
    { value: "hcp", label: "Healthcare Professional" },
    { value: "patient", label: "Patient" },
    { value: "campaign", label: "Campaign" },
    { value: "disease", label: "Disease Awareness" },
    { value: "brand", label: "Brand" },
    { value: "other", label: "Other" }
  ];
  const getCategoryLabel = (categoryId) => {
    const category = websiteCategories.find((c) => c.value === categoryId);
    return category ? category.label : categoryId;
  };
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Websites", href: "/websites" },
    { label: website.domain, href: `/websites/${slug}`, active: true }
  ];
  const activeTab = "overview";
  const tabs = [
    { id: "overview", label: "Overview", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    { id: "technical", label: "Technical Details", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>' },
    { id: "features", label: "Features & Functionality", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>' },
    { id: "ownership", label: "Ownership & Links", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' },
    { id: "content", label: "Content & Compliance", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>' }
  ];
  const getTherapeuticAreaName = (areaId) => {
    const area = therapeuticAreas.find((a) => a.id === areaId);
    return area ? area.name : areaId.replace(/-/g, " ");
  };
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": `${website.domain} | Website Details | Top Pharma`, "description": `Detailed information about ${website.domain} pharmaceutical website`, "currentPath": `/websites/${slug}`, "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- Website Header Section - Updated to match company header structure --> <div class="relative"> <!-- Header Background --> <div class="h-48 w-full bg-gradient-to-r from-purple-600 to-purple-700 relative overflow-hidden shadow-md">  </div> <!-- Website Info Card --> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"> <div class="bg-white rounded-lg shadow-lg overflow-hidden -mt-24 mb-8"> <div class="p-6 sm:p-8"> <div class="flex flex-col md:flex-row items-start md:items-center"> <!-- Website Icon --> <div class="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden mr-6 mb-4 md:mb-0"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path> </svg> </div> <!-- Website Basic Info --> <div class="flex-grow"> <div class="flex items-center justify-between flex-wrap"> <div> <h1 class="text-2xl font-bold text-gray-900 mr-4">${website.domain}</h1> ${website.siteName && renderTemplate`<p class="text-gray-500 text-sm">${website.siteName}</p>`} </div> <div class="flex space-x-3 mt-2 md:mt-0"> ${renderComponent($$result2, "Button", $$Button, { "href": `https://${website.domain}`, "target": "_blank", "variant": "outline", "size": "sm" }, { "default": ($$result3) => renderTemplate` <span class="flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg>
Visit Website
</span> ` })} ${renderComponent($$result2, "Button", $$Button, { "variant": "outline", "size": "sm" }, { "default": ($$result3) => renderTemplate` <span class="flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path> </svg>
Refresh Data
</span> ` })} </div> </div> <div class="mt-2 flex flex-wrap items-center text-sm text-gray-500"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2"> ${getCategoryLabel(website.category)} </span> ${website.lastUpdated && renderTemplate`<span class="mr-4">Updated: ${formatDate(website.lastUpdated)}</span>`} </div> </div> </div> </div>  ${company && renderTemplate`<div class="bg-gray-50 px-6 sm:px-8 py-3 border-t border-gray-200"> <div class="flex items-center text-gray-700"> <span class="text-sm mr-2">Owned by:</span> <a${addAttribute(`/companies/${company.slug}`, "href")} class="text-primary-600 hover:text-primary-800 font-medium text-sm"> ${company.name} </a> </div> </div>`} </div> </div> </div> <!-- Tabs Navigation --> ${renderComponent($$result2, "TabGroup", $$TabGroup, { "tabs": tabs, "activeTab": activeTab, "tabPanelId": "website-tab-content" })} <!-- Tab Content --> <div class="mt-6"> <!-- Overview Tab --> <div id="website-tab-content-overview" role="tabpanel" aria-labelledby="tab-overview" class="space-y-6"> <!-- Website Preview Card --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="md:flex"> <div class="md:w-1/2 lg:w-2/3 p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Website Overview</h2> <div class="space-y-4"> ${website.description ? renderTemplate`<p class="text-gray-700">${website.description}</p>` : renderTemplate`<p class="text-gray-500 italic">No description available for this website.</p>`} <div class="flex flex-wrap gap-2"> ${website.therapeuticAreas && website.therapeuticAreas.map((areaId) => renderTemplate`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"> ${getTherapeuticAreaName(areaId)} </span>`)} </div> <div class="pt-4 border-t border-gray-200"> <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4"> <div> <dt class="text-sm font-medium text-gray-500">Category</dt> <dd class="mt-1 text-sm text-gray-900">${getCategoryLabel(website.category)}</dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Created</dt> <dd class="mt-1 text-sm text-gray-900">${formatDate(website.created_at)}</dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Last Updated</dt> <dd class="mt-1 text-sm text-gray-900">${formatDate(website.updated_at)}</dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Status</dt> <dd class="mt-1 text-sm text-gray-900"> ${website.status === "active" ? renderTemplate`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Active
</span>` : renderTemplate`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
Inactive
</span>`} </dd> </div> </dl> </div> </div> </div> <div class="md:w-1/2 lg:w-1/3 border-t md:border-t-0 md:border-l border-gray-200"> ${website.screenshotUrl ? renderTemplate`<div class="relative h-64 md:h-full"> <img${addAttribute(getWebsiteScreenshotUrl(website.domain), "src")}${addAttribute(`Screenshot of ${website.domain}`, "alt")} class="absolute inset-0 w-full h-full object-cover"> </div>` : renderTemplate`<div class="flex items-center justify-center h-64 md:h-full bg-gray-100 p-6"> <div class="text-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <p class="mt-2 text-sm text-gray-500">Screenshot not available</p> </div> </div>`} </div> </div> ` })} <!-- Associated Products Card --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Associated Products</h2> ${associatedProducts.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> ${associatedProducts.map((product) => renderTemplate`<div class="border border-gray-200 rounded-lg shadow-sm overflow-hidden"> <div class="p-4"> <h3 class="font-medium text-gray-900">${product.name}</h3> ${product.genericName && renderTemplate`<p class="text-sm text-gray-500 italic">${product.genericName}</p>`} <div class="mt-2 flex justify-between items-center"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"> ${product.stage} </span> <a${addAttribute(`/products/${product.slug}`, "href")} class="text-sm font-medium text-blue-600 hover:text-blue-800">
View details
</a> </div> </div> </div>`)} </div>` : renderTemplate`<p class="text-gray-500 italic">No products are associated with this website.</p>`} </div> ` })} </div> <!-- Technical Details Tab --> <div id="website-tab-content-technical" role="tabpanel" aria-labelledby="tab-technical" class="space-y-6 hidden"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Technical Information</h2> <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> <div> <dt class="text-sm font-medium text-gray-500">Domain</dt> <dd class="mt-1 text-sm text-gray-900">${website.domain}</dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Registrar</dt> <dd class="mt-1 text-sm text-gray-900">${website.registrar || "Unknown"}</dd> </div> <div> <dt class="text-sm font-medium text-gray-500">SSL Certificate</dt> <dd class="mt-1 text-sm text-gray-900"> ${website.hasSSL ? renderTemplate`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Secure (HTTPS)
</span>` : renderTemplate`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
Not Secure (HTTP)
</span>`} </dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Host Provider</dt> <dd class="mt-1 text-sm text-gray-900">${website.hosting_provider || "Unknown"}</dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Domain Creation Date</dt> <dd class="mt-1 text-sm text-gray-900">${formatDate(website.domain_created_at) || "Unknown"}</dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Domain Expiry Date</dt> <dd class="mt-1 text-sm text-gray-900">${formatDate(website.domain_expires_at) || "Unknown"}</dd> </div> </dl> </div> ` })} ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Technology Stack</h2> ${website.technologies && website.technologies.length > 0 ? renderTemplate`<div class="space-y-4"> <div class="flex flex-wrap gap-2"> ${website.technologies.map((tech) => renderTemplate`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"> ${tech} </span>`)} </div> </div>` : renderTemplate`<p class="text-gray-500 italic">No technology stack information available.</p>`} </div> ` })} </div> <!-- Features & Functionality Tab --> <div id="website-tab-content-features" role="tabpanel" aria-labelledby="tab-features" class="space-y-6 hidden"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Website Features</h2> <p class="text-gray-500 italic">No features information available for this website.</p> </div> ` })} </div> <!-- Ownership & Links Tab --> <div id="website-tab-content-ownership" role="tabpanel" aria-labelledby="tab-ownership" class="space-y-6 hidden"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Company Information</h2> ${company ? renderTemplate`<div class="flex items-start space-x-4"> ${company.logoUrl ? renderTemplate`<div class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"> <img${addAttribute(company.logoUrl, "src")}${addAttribute(`${company.name} logo`, "alt")} class="w-full h-full object-contain"> </div>` : renderTemplate`<div class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center"> <span class="text-2xl font-bold text-gray-500">${company.name.charAt(0)}</span> </div>`} <div> <h3 class="text-lg font-medium text-gray-900">${company.name}</h3> ${company.description && renderTemplate`<p class="mt-1 text-sm text-gray-500 line-clamp-2">${company.description}</p>`} <div class="mt-2"> <a${addAttribute(`/companies/${company.slug}`, "href")} class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
View company details
<svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div> </div>` : renderTemplate`<p class="text-gray-500 italic">No company information available for this website.</p>`} </div> ` })} ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Related Websites</h2> ${relatedWebsites.length > 0 ? renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> ${relatedWebsites.map((relatedSite) => renderTemplate`<div class="border border-gray-200 rounded-lg shadow-sm overflow-hidden"> <div class="p-4"> <div class="flex justify-between items-start"> <h3 class="font-medium text-gray-900">${relatedSite.domain}</h3> <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"> ${getCategoryLabel(relatedSite.category)} </span> </div> <div class="mt-2 flex justify-between items-center"> <a${addAttribute(`/websites/${relatedSite.slug}`, "href")} class="text-sm font-medium text-blue-600 hover:text-blue-800">
View details
</a> <a${addAttribute(`https://${relatedSite.domain}`, "href")} target="_blank" rel="noopener noreferrer" class="text-sm text-gray-500 hover:text-gray-700">
Visit site →
</a> </div> </div> </div>`)} </div>` : renderTemplate`<p class="text-gray-500 italic">No related websites found.</p>`} </div> ` })} </div> <!-- Content & Compliance Tab --> <div id="website-tab-content-content" role="tabpanel" aria-labelledby="tab-content" class="space-y-6 hidden"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Content Analysis</h2> <p class="text-gray-500 italic">No content analysis available for this website.</p> </div> ` })} ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-xl font-medium text-gray-900 mb-4">Compliance Information</h2> <p class="text-gray-500 italic">No compliance information available for this website.</p> </div> ` })} </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/websites/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/websites/[slug].astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/websites/[slug].astro";
const $$url = "/websites/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
