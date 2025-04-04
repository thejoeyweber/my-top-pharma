import { c as createComponent, a as createAstro, m as maybeRenderHead, e as addAttribute, f as renderScript, b as renderTemplate, r as renderComponent } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
import { $ as $$ViewToggle, a as $$MultiSelect } from '../chunks/ViewToggle_COa3FoTf.mjs';
import 'clsx';
import { $ as $$SortSelect } from '../chunks/SortSelect_CdQ1pDyo.mjs';
import { $ as $$CompanyCard } from '../chunks/CompanyCard_D95u1ucE.mjs';
import { $ as $$DataSourceVisualizer } from '../chunks/DataSourceVisualizer_CXj8ahGU.mjs';
import { s as supabase } from '../chunks/supabase_C3b6n6m6.mjs';
import { d as dbCompanyToCompany } from '../chunks/Company_c_JEsIwc.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$RangeSlider = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$RangeSlider;
  const {
    label,
    name,
    min,
    max,
    step = 1,
    initialMin = min,
    initialMax = max,
    class: className = ""
  } = Astro2.props;
  const sliderId = `range-slider-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["range-slider", className], "class:list")} data-range-slider${addAttribute(sliderId, "id")}> <label class="block text-sm font-medium text-gray-700 mb-1">${label}</label> <div class="mt-2 space-y-6"> <!-- Slider track and handles --> <div class="relative"> <div class="h-2 w-full rounded-md bg-gray-200 absolute pointer-events-none" data-slider-track> <div class="absolute h-full rounded-md bg-primary-500" data-slider-range${addAttribute({
    left: `${(initialMin - min) / (max - min) * 100}%`,
    width: `${(initialMax - initialMin) / (max - min) * 100}%`
  }, "style")}></div> </div> <input type="range" class="absolute w-full h-2 opacity-0 cursor-pointer"${addAttribute(min, "min")}${addAttribute(max, "max")}${addAttribute(step, "step")}${addAttribute(initialMin, "value")} data-slider-min-input> <input type="range" class="absolute w-full h-2 opacity-0 cursor-pointer"${addAttribute(min, "min")}${addAttribute(max, "max")}${addAttribute(step, "step")}${addAttribute(initialMax, "value")} data-slider-max-input> <!-- Slider thumbs --> <div class="absolute -top-1.5 w-5 h-5 rounded-full border-2 border-primary-500 bg-white shadow transform -translate-x-1/2 cursor-grab" data-slider-min-thumb${addAttribute({ left: `${(initialMin - min) / (max - min) * 100}%` }, "style")}></div> <div class="absolute -top-1.5 w-5 h-5 rounded-full border-2 border-primary-500 bg-white shadow transform -translate-x-1/2 cursor-grab" data-slider-max-thumb${addAttribute({ left: `${(initialMax - min) / (max - min) * 100}%` }, "style")}></div> </div> <!-- Value inputs --> <div class="flex items-center space-x-4"> <div class="w-full"> <label${addAttribute(`${name}-min`, "for")} class="sr-only">Minimum value</label> <input type="number"${addAttribute(`${name}-min`, "id")} class="w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"${addAttribute(min, "min")}${addAttribute(max, "max")}${addAttribute(step, "step")}${addAttribute(initialMin, "value")} data-min-value-input> <input type="hidden"${addAttribute(`${name}[min]`, "name")}${addAttribute(initialMin, "value")} data-min-value-hidden> </div> <span class="text-gray-500">to</span> <div class="w-full"> <label${addAttribute(`${name}-max`, "for")} class="sr-only">Maximum value</label> <input type="number"${addAttribute(`${name}-max`, "id")} class="w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"${addAttribute(min, "min")}${addAttribute(max, "max")}${addAttribute(step, "step")}${addAttribute(initialMax, "value")} data-max-value-input> <input type="hidden"${addAttribute(`${name}[max]`, "name")}${addAttribute(initialMax, "value")} data-max-value-hidden> </div> </div> </div> </div> ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/RangeSlider.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/RangeSlider.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const url = new URL(Astro2.request.url);
  const params = url.searchParams;
  const sortParam = params.get("sort") || "name_asc";
  const viewMode = params.get("view") || "grid";
  const search = params.get("search") || "";
  const selectedRegions = params.get("regions")?.split(",") || [];
  const selectedTAs = params.get("tas")?.split(",") || [];
  const minMarketCap = params.get("minMarketCap") ? parseInt(params.get("minMarketCap")) : 0;
  const maxMarketCap = params.get("maxMarketCap") ? parseInt(params.get("maxMarketCap")) : 2e3;
  const [sortField, sortDirection] = sortParam.split("_");
  let query = supabase.from("companies").select("*");
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  if (selectedRegions.length > 0) {
    query = query.in("headquarters", selectedRegions);
  }
  if (minMarketCap > 0) {
    query = query.gte("market_cap", minMarketCap);
  }
  if (maxMarketCap < 2e3) {
    query = query.lte("market_cap", maxMarketCap);
  }
  if (sortField === "name") {
    query = query.order("name", { ascending: sortDirection === "asc" });
  } else if (sortField === "marketCap") {
    query = query.order("market_cap", { ascending: sortDirection === "asc" });
  } else if (sortField === "founded") {
    query = query.order("founded", { ascending: sortDirection === "asc" });
  }
  const { data: dbCompanies, error } = await query;
  if (error) {
    console.error("Error fetching companies:", error);
  }
  const companies = (dbCompanies || []).map(dbCompanyToCompany);
  const { data: therapeuticAreasData, error: taError } = await supabase.from("therapeutic_areas").select("*").order("name");
  if (taError) {
    console.error("Error fetching therapeutic areas:", taError);
  }
  const therapeuticAreas = (therapeuticAreasData || []).map((area) => ({
    value: area.id,
    label: area.name
  }));
  let filteredCompanies = companies;
  if (selectedTAs.length > 0) {
    const { data: companyTAs, error: ctaError } = await supabase.from("company_therapeutic_areas").select("company_id, therapeutic_area_id").in("therapeutic_area_id", selectedTAs);
    if (ctaError) {
      console.error("Error fetching company-therapeutic area relations:", ctaError);
    }
    const companyIds = [...new Set((companyTAs || []).map((cta) => cta.company_id))];
    filteredCompanies = companies.filter((company) => companyIds.includes(company.id));
  }
  const companyTaNames = /* @__PURE__ */ new Map();
  const { data: allCompanyTAs, error: allCtaError } = await supabase.from("company_therapeutic_areas").select("company_id, therapeutic_area_id");
  if (allCtaError) {
    console.error("Error fetching all company-therapeutic area relations:", allCtaError);
  }
  const companyTaMap = /* @__PURE__ */ new Map();
  (allCompanyTAs || []).forEach((cta) => {
    const taIds = companyTaMap.get(cta.company_id) || [];
    companyTaMap.set(cta.company_id, [...taIds, cta.therapeutic_area_id]);
  });
  const taNameMap = /* @__PURE__ */ new Map();
  therapeuticAreasData?.forEach((ta) => {
    taNameMap.set(ta.id, ta.name);
  });
  filteredCompanies.forEach((company) => {
    const taIds = companyTaMap.get(company.id) || [];
    const taNames = taIds.map((id) => taNameMap.get(id)).filter(Boolean);
    companyTaNames.set(company.id, taNames);
  });
  const regions = [
    { value: "north-america", label: "North America" },
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia" },
    { value: "united-states", label: "United States" },
    { value: "switzerland", label: "Switzerland" },
    { value: "germany", label: "Germany" },
    { value: "japan", label: "Japan" },
    { value: "united-kingdom", label: "United Kingdom" },
    { value: "france", label: "France" },
    { value: "china", label: "China" },
    { value: "other", label: "Other" }
  ];
  const sortOptions = [
    { value: "name_asc", label: "Name (A to Z)" },
    { value: "name_desc", label: "Name (Z to A)" },
    { value: "marketCap_desc", label: "Market Cap (High to Low)" },
    { value: "marketCap_asc", label: "Market Cap (Low to High)" },
    { value: "founded_desc", label: "Founded (Newest First)" },
    { value: "founded_asc", label: "Founded (Oldest First)" }
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
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Pharmaceutical Companies" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Added visual header that connects to detail page design --> <div class="mb-6 overflow-hidden"> <div class="flex border border-gray-100 rounded-lg shadow-sm overflow-hidden"> <div class="w-3 bg-gradient-to-b from-blue-600 to-blue-700"></div> <div class="p-6 flex items-center"> <div class="bg-white p-3 rounded-full shadow-sm mr-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path> </svg> </div> <div> <h1 class="text-2xl font-bold text-gray-900">Companies</h1> <p class="text-gray-600 text-sm">Browse and discover pharmaceutical companies in our database</p> </div> </div> </div> </div> <!-- Filter Bar --> <div class="mb-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <form id="filter-form" method="get" action="/companies"> <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"> <!-- Search input --> <div class="w-full md:w-1/3"> <input type="text" id="search" name="search"${addAttribute(search, "value")} placeholder="Search companies..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"> </div> <!-- View and Sort Options --> <div class="flex items-center space-x-3"> ${renderComponent($$result3, "ViewToggle", $$ViewToggle, { "options": [
    { value: "grid", label: "Grid", icon: "grid" },
    { value: "list", label: "List", icon: "list" }
  ], "activeOption": viewMode, "onChange": (value) => updateUrlParams({ view: value }) })} ${renderComponent($$result3, "SortSelect", $$SortSelect, { "options": sortOptions, "selected": sortParam, "onChange": (value) => updateUrlParams({ sort: value }) })} </div> </div> <!-- Advanced Filters (collapsible) --> <details class="mt-4"> <summary class="cursor-pointer text-blue-600 font-medium mb-3">Advanced Filters</summary> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md"> <!-- Region Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Regions</label> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "options": regions, "selected": selectedRegions, "name": "regions", "onChange": (values) => {
    document.querySelector('input[name="regions"]').value = values.join(",");
  } })} <input type="hidden" name="regions"${addAttribute(selectedRegions.join(","), "value")}> </div> <!-- Therapeutic Areas Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Therapeutic Areas</label> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "options": therapeuticAreas, "selected": selectedTAs, "name": "tas", "onChange": (values) => {
    document.querySelector('input[name="tas"]').value = values.join(",");
  } })} <input type="hidden" name="tas"${addAttribute(selectedTAs.join(","), "value")}> </div> <!-- Market Cap Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Market Cap Range ($B)</label> ${renderComponent($$result3, "RangeSlider", $$RangeSlider, { "min": 0, "max": 2e3, "step": 10, "minValue": minMarketCap, "maxValue": maxMarketCap, "unit": "B", "onChange": (min, max) => {
    document.querySelector('input[name="minMarketCap"]').value = min.toString();
    document.querySelector('input[name="maxMarketCap"]').value = max.toString();
  } })} <input type="hidden" name="minMarketCap"${addAttribute(minMarketCap.toString(), "value")}> <input type="hidden" name="maxMarketCap"${addAttribute(maxMarketCap.toString(), "value")}> </div> </div> <!-- Filter Action Buttons --> <div class="flex justify-end mt-4 space-x-2"> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "primary" }, { "default": ($$result4) => renderTemplate`Apply Filters` })} ${renderComponent($$result3, "Button", $$Button, { "type": "button", "variant": "outline", "onClick": () => {
    window.location.href = "/companies";
  } }, { "default": ($$result4) => renderTemplate`
Reset
` })} </div> </details> <!-- Maintain view and sort in form submission --> <input type="hidden" name="view"${addAttribute(viewMode, "value")}> <input type="hidden" name="sort"${addAttribute(sortParam, "value")}> </form> </div> ` })} </div> <!-- Results Count --> <div class="mb-4"> <p class="text-sm text-gray-600">
Showing <span class="font-medium">${filteredCompanies.length}</span> companies
</p> </div> <!-- Companies Results --> ${filteredCompanies.length === 0 ? renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-8 text-center"> <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <h3 class="mt-2 text-lg font-medium text-gray-900">No companies found</h3> <p class="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p> <div class="mt-6"> ${renderComponent($$result3, "Button", $$Button, { "href": "/companies", "variant": "primary" }, { "default": ($$result4) => renderTemplate`
Reset Filters
` })} </div> </div> ` })}` : renderTemplate`<div${addAttribute(`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`, "class")}> ${filteredCompanies.map((company) => renderTemplate`${renderComponent($$result2, "CompanyCard", $$CompanyCard, { "company": company, "therapeuticAreaNames": companyTaNames.get(company.id) || [], "view": viewMode })}`)} </div>`} <!-- Data Source Indicator --> <div class="mt-8"> ${renderComponent($$result2, "DataSourceVisualizer", $$DataSourceVisualizer, {})} </div> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/companies/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/companies/index.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/companies/index.astro";
const $$url = "/companies";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
