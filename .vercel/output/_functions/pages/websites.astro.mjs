import { c as createComponent, a as createAstro, r as renderComponent, f as renderScript, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
import { $ as $$ViewToggle, a as $$MultiSelect } from '../chunks/ViewToggle_COa3FoTf.mjs';
import { $ as $$SortSelect } from '../chunks/SortSelect_CdQ1pDyo.mjs';
import { $ as $$WebsiteCard } from '../chunks/WebsiteCard_CosUamye.mjs';
import { $ as $$DataSourceVisualizer } from '../chunks/DataSourceVisualizer_CXj8ahGU.mjs';
import { s as supabase } from '../chunks/supabase_C3b6n6m6.mjs';
import { d as dbWebsiteToWebsite } from '../chunks/Website__PBY8XlA.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const url = new URL(Astro2.request.url);
  const params = url.searchParams;
  const sortParam = params.get("sort") || "domain_asc";
  const viewMode = params.get("view") || "grid";
  const search = params.get("search") || "";
  const selectedCompanies = params.get("companies")?.split(",") || [];
  const selectedTAs = params.get("tas")?.split(",") || [];
  const websiteTypes = params.get("types")?.split(",") || [];
  const [sortField, sortDirection] = sortParam.split("_");
  let query = supabase.from("websites").select("*");
  if (search) {
    query = query.or(`domain.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (selectedCompanies.length > 0) {
    query = query.in("company_id", selectedCompanies);
  }
  if (websiteTypes.length > 0) {
    query = query.in("website_type", websiteTypes);
  }
  if (sortField === "domain") {
    query = query.order("domain", { ascending: sortDirection === "asc" });
  } else if (sortField === "title") {
    query = query.order("title", { ascending: sortDirection === "asc" });
  } else if (sortField === "date") {
    query = query.order("created_at", { ascending: sortDirection === "asc" });
  }
  const { data: dbWebsites, error: websitesError } = await query;
  if (websitesError) {
    console.error("Error fetching websites:", websitesError);
  }
  const websites = (dbWebsites || []).map(dbWebsiteToWebsite);
  let filteredWebsites = websites;
  if (selectedTAs.length > 0) {
    const { data: companyTAs, error: ctaError } = await supabase.from("company_therapeutic_areas").select("company_id").in("therapeutic_area_id", selectedTAs);
    if (ctaError) {
      console.error("Error fetching company-therapeutic area relations:", ctaError);
    }
    const companyIds = [...new Set((companyTAs || []).map((cta) => cta.company_id))];
    filteredWebsites = websites.filter(
      (website) => website.companyId && companyIds.includes(website.companyId)
    );
  }
  const { data: dbCompanies, error: companiesError } = await supabase.from("companies").select("id, name").order("name");
  if (companiesError) {
    console.error("Error fetching companies:", companiesError);
  }
  const companyOptions = (dbCompanies || []).map((company) => ({
    value: company.id,
    label: company.name
  }));
  const { data: dbTherapeuticAreas, error: taError } = await supabase.from("therapeutic_areas").select("id, name").order("name");
  if (taError) {
    console.error("Error fetching therapeutic areas:", taError);
  }
  const therapeuticAreaOptions = (dbTherapeuticAreas || []).map((ta) => ({
    value: ta.id,
    label: ta.name
  }));
  const companyNameMap = /* @__PURE__ */ new Map();
  (dbCompanies || []).forEach((company) => {
    companyNameMap.set(company.id, company.name);
  });
  const websiteTaNames = /* @__PURE__ */ new Map();
  const { data: allCompanyTAs, error: allCtaError } = await supabase.from("company_therapeutic_areas").select("company_id, therapeutic_area_id");
  if (allCtaError) {
    console.error("Error fetching all company-therapeutic area relations:", allCtaError);
  }
  const companyTaMap = /* @__PURE__ */ new Map();
  (allCompanyTAs || []).forEach((relation) => {
    const taIds = companyTaMap.get(relation.company_id) || [];
    companyTaMap.set(relation.company_id, [...taIds, relation.therapeutic_area_id]);
  });
  const taNameMap = /* @__PURE__ */ new Map();
  (dbTherapeuticAreas || []).forEach((ta) => {
    taNameMap.set(ta.id, ta.name);
  });
  filteredWebsites.forEach((website) => {
    if (website.companyId) {
      const taIds = companyTaMap.get(website.companyId) || [];
      const taNames = taIds.map((id) => taNameMap.get(id)).filter(Boolean);
      websiteTaNames.set(website.id, taNames);
    } else {
      websiteTaNames.set(website.id, []);
    }
  });
  const websiteTypeOptions = [
    { value: "corporate", label: "Corporate" },
    { value: "product", label: "Product" },
    { value: "research", label: "Research" },
    { value: "disease", label: "Disease Awareness" },
    { value: "patient", label: "Patient Support" },
    { value: "news", label: "News" },
    { value: "other", label: "Other" }
  ];
  const sortOptions = [
    { value: "domain_asc", label: "Domain (A to Z)" },
    { value: "domain_desc", label: "Domain (Z to A)" },
    { value: "title_asc", label: "Title (A to Z)" },
    { value: "title_desc", label: "Title (Z to A)" },
    { value: "date_desc", label: "Newest First" },
    { value: "date_asc", label: "Oldest First" }
  ];
  const updateUrlParams = (updates) => {
    const newUrl = new URL(Astro2.request.url);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newUrl.searchParams.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length) {
          newUrl.searchParams.set(key, value.join(","));
        } else {
          newUrl.searchParams.delete(key);
        }
      } else {
        newUrl.searchParams.set(key, value);
      }
    });
    return newUrl.pathname + newUrl.search;
  };
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Pharmaceutical Websites" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Added visual header that connects to detail page design --> <div class="mb-6 overflow-hidden"> <div class="flex border border-gray-100 rounded-lg shadow-sm overflow-hidden"> <div class="w-3 bg-gradient-to-b from-purple-600 to-purple-700"></div> <div class="p-6 flex items-center"> <div class="bg-white p-3 rounded-full shadow-sm mr-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path> </svg> </div> <div> <h1 class="text-2xl font-bold text-gray-900">Websites</h1> <p class="text-gray-600 text-sm">Discover online platforms for pharmaceutical companies and products</p> </div> </div> </div> </div> <!-- Filter Bar --> <div class="mb-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <form id="filter-form" method="get" action="/websites"> <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"> <!-- Search input --> <div class="w-full md:w-1/3"> <input type="text" id="search" name="search"${addAttribute(search, "value")} placeholder="Search websites..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"> </div> <!-- View and Sort Options --> <div class="flex items-center space-x-3"> ${renderComponent($$result3, "ViewToggle", $$ViewToggle, { "options": [
    { value: "grid", label: "Grid", icon: "grid" },
    { value: "list", label: "List", icon: "list" }
  ], "activeOption": viewMode, "onChange": (value) => updateUrlParams({ view: value }) })} ${renderComponent($$result3, "SortSelect", $$SortSelect, { "options": sortOptions, "selected": sortParam, "onChange": (value) => updateUrlParams({ sort: value }) })} </div> </div> <!-- Advanced Filters (collapsible) --> <details class="mt-4"> <summary class="cursor-pointer text-blue-600 font-medium mb-3">Advanced Filters</summary> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md"> <!-- Company Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Companies</label> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "options": companyOptions, "selected": selectedCompanies, "name": "companies", "onChange": (values) => {
    document.querySelector('input[name="companies"]').value = values.join(",");
  } })} <input type="hidden" name="companies"${addAttribute(selectedCompanies.join(","), "value")}> </div> <!-- Therapeutic Areas Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Therapeutic Areas</label> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "options": therapeuticAreaOptions, "selected": selectedTAs, "name": "tas", "onChange": (values) => {
    document.querySelector('input[name="tas"]').value = values.join(",");
  } })} <input type="hidden" name="tas"${addAttribute(selectedTAs.join(","), "value")}> </div> <!-- Website Type Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Website Types</label> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "options": websiteTypeOptions, "selected": websiteTypes, "name": "types", "onChange": (values) => {
    document.querySelector('input[name="types"]').value = values.join(",");
  } })} <input type="hidden" name="types"${addAttribute(websiteTypes.join(","), "value")}> </div> </div> <!-- Filter Action Buttons --> <div class="flex justify-end mt-4 space-x-2"> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "primary" }, { "default": ($$result4) => renderTemplate`Apply Filters` })} ${renderComponent($$result3, "Button", $$Button, { "type": "button", "variant": "outline", "onClick": () => {
    window.location.href = "/websites";
  } }, { "default": ($$result4) => renderTemplate`
Reset
` })} </div> </details> <!-- Maintain view and sort in form submission --> <input type="hidden" name="view"${addAttribute(viewMode, "value")}> <input type="hidden" name="sort"${addAttribute(sortParam, "value")}> </form> </div> ` })} </div> <!-- Results Count --> <div class="mb-4"> <p class="text-sm text-gray-600">
Showing <span class="font-medium">${filteredWebsites.length}</span> websites
</p> </div> <!-- Websites Results --> ${filteredWebsites.length === 0 ? renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-8 text-center"> <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <h3 class="mt-2 text-lg font-medium text-gray-900">No websites found</h3> <p class="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p> <div class="mt-6"> ${renderComponent($$result3, "Button", $$Button, { "href": "/websites", "variant": "primary" }, { "default": ($$result4) => renderTemplate`
Reset Filters
` })} </div> </div> ` })}` : renderTemplate`<div${addAttribute(`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`, "class")}> ${filteredWebsites.map((website) => renderTemplate`${renderComponent($$result2, "WebsiteCard", $$WebsiteCard, { "website": website, "companyName": website.companyId ? companyNameMap.get(website.companyId) : void 0, "therapeuticAreaNames": websiteTaNames.get(website.id) || [], "view": viewMode })}`)} </div>`} <!-- Data Source Indicator --> <div class="mt-8"> ${renderComponent($$result2, "DataSourceVisualizer", $$DataSourceVisualizer, {})} </div> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/websites/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/websites/index.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/websites/index.astro";
const $$url = "/websites";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
