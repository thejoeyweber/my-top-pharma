import { c as createComponent, a as createAstro, r as renderComponent, f as renderScript, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
import { $ as $$SortSelect } from '../chunks/SortSelect_CdQ1pDyo.mjs';
import { $ as $$ViewToggle, a as $$MultiSelect } from '../chunks/ViewToggle_COa3FoTf.mjs';
import { $ as $$ProductCard } from '../chunks/ProductCard_DxXaD_LP.mjs';
import { $ as $$DataSourceVisualizer } from '../chunks/DataSourceVisualizer_CXj8ahGU.mjs';
import { s as supabase } from '../chunks/supabase_C3b6n6m6.mjs';
import { d as dbProductToProduct } from '../chunks/Product_D6fkeiyM.mjs';
import { d as dbCompanyToCompany } from '../chunks/Company_c_JEsIwc.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const url = new URL(Astro2.request.url);
  const params = url.searchParams;
  const sortParam = params.get("sort") || "name_asc";
  const viewMode = params.get("view") || "grid";
  const search = params.get("search") || "";
  const selectedCompanies = params.get("companies")?.split(",") || [];
  const selectedTAs = params.get("tas")?.split(",") || [];
  const selectedStages = params.get("stages")?.split(",") || [];
  const [sortField, sortDirection] = sortParam.split("_");
  let query = supabase.from("products").select("*");
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  if (selectedCompanies.length > 0) {
    query = query.in("company_id", selectedCompanies);
  }
  if (selectedStages.length > 0) {
    query = query.in("development_stage", selectedStages);
  }
  if (sortField === "name") {
    query = query.order("name", { ascending: sortDirection === "asc" });
  } else if (sortField === "stage") {
    query = query.order("development_stage", { ascending: sortDirection === "asc" });
  } else ;
  const { data: dbProducts, error: productsError } = await query;
  if (productsError) {
    console.error("Error fetching products:", productsError);
  }
  const products = (dbProducts || []).map(dbProductToProduct);
  const { data: dbTherapeuticAreas, error: taError } = await supabase.from("therapeutic_areas").select("*").order("name");
  if (taError) {
    console.error("Error fetching therapeutic areas:", taError);
  }
  const therapeuticAreas = (dbTherapeuticAreas || []).map((ta) => ({
    value: ta.id,
    label: ta.name
  }));
  let filteredProducts = products;
  if (selectedTAs.length > 0) {
    const { data: productTAs, error: ptaError } = await supabase.from("product_therapeutic_areas").select("product_id, therapeutic_area_id").in("therapeutic_area_id", selectedTAs);
    if (ptaError) {
      console.error("Error fetching product-therapeutic area relations:", ptaError);
    }
    const productIds = [...new Set((productTAs || []).map((pta) => pta.product_id))];
    filteredProducts = products.filter((product) => productIds.includes(product.id));
  }
  if (sortField === "company") {
    const { data: companiesData, error: companiesError } = await supabase.from("companies").select("id, name");
    if (companiesError) {
      console.error("Error fetching companies for sorting:", companiesError);
    }
    const companyNameMap = /* @__PURE__ */ new Map();
    (companiesData || []).forEach((company) => {
      companyNameMap.set(company.id, company.name);
    });
    filteredProducts.sort((a, b) => {
      const companyA = companyNameMap.get(a.companyId) || "";
      const companyB = companyNameMap.get(b.companyId) || "";
      if (sortDirection === "asc") {
        return companyA.localeCompare(companyB);
      } else {
        return companyB.localeCompare(companyA);
      }
    });
  }
  const companyMap = /* @__PURE__ */ new Map();
  const companyIds = [...new Set(filteredProducts.map((product) => product.companyId))];
  if (companyIds.length > 0) {
    const { data: companiesData, error: companiesError } = await supabase.from("companies").select("*").in("id", companyIds);
    if (companiesError) {
      console.error("Error fetching companies for products:", companiesError);
    }
    (companiesData || []).forEach((company) => {
      companyMap.set(company.id, dbCompanyToCompany(company));
    });
  }
  const productTaNames = /* @__PURE__ */ new Map();
  const { data: allProductTAs, error: allPtaError } = await supabase.from("product_therapeutic_areas").select("product_id, therapeutic_area_id");
  if (allPtaError) {
    console.error("Error fetching all product-therapeutic area relations:", allPtaError);
  }
  const productTaMap = /* @__PURE__ */ new Map();
  (allProductTAs || []).forEach((pta) => {
    const taIds = productTaMap.get(pta.product_id) || [];
    productTaMap.set(pta.product_id, [...taIds, pta.therapeutic_area_id]);
  });
  const taNameMap = /* @__PURE__ */ new Map();
  dbTherapeuticAreas?.forEach((ta) => {
    taNameMap.set(ta.id, ta.name);
  });
  filteredProducts.forEach((product) => {
    const taIds = productTaMap.get(product.id) || [];
    const taNames = taIds.map((id) => taNameMap.get(id)).filter(Boolean);
    productTaNames.set(product.id, taNames);
  });
  const { data: allCompaniesData, error: allCompaniesError } = await supabase.from("companies").select("id, name").order("name");
  if (allCompaniesError) {
    console.error("Error fetching all companies for filtering:", allCompaniesError);
  }
  const companyOptions = (allCompaniesData || []).map((company) => ({
    value: company.id,
    label: company.name
  }));
  const stageOptions = [
    { value: "discovery", label: "Discovery" },
    { value: "preclinical", label: "Preclinical" },
    { value: "phase1", label: "Phase 1" },
    { value: "phase2", label: "Phase 2" },
    { value: "phase3", label: "Phase 3" },
    { value: "approved", label: "Approved" },
    { value: "marketed", label: "Marketed" }
  ];
  const sortOptions = [
    { value: "name_asc", label: "Name (A to Z)" },
    { value: "name_desc", label: "Name (Z to A)" },
    { value: "company_asc", label: "Company (A to Z)" },
    { value: "company_desc", label: "Company (Z to A)" },
    { value: "stage_asc", label: "Stage (Early to Late)" },
    { value: "stage_desc", label: "Stage (Late to Early)" }
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
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Pharmaceutical Products" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Added visual header that connects to detail page design --> <div class="mb-6 overflow-hidden"> <div class="flex border border-gray-100 rounded-lg shadow-sm overflow-hidden"> <div class="w-3 bg-gradient-to-b from-green-600 to-green-700"></div> <div class="p-6 flex items-center"> <div class="bg-white p-3 rounded-full shadow-sm mr-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path> </svg> </div> <div> <h1 class="text-2xl font-bold text-gray-900">Products</h1> <p class="text-gray-600 text-sm">Explore pharmaceutical products and medications in our database</p> </div> </div> </div> </div> <!-- Filter Bar --> <div class="mb-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <form id="filter-form" method="get" action="/products"> <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"> <!-- Search input --> <div class="w-full md:w-1/3"> <input type="text" id="search" name="search"${addAttribute(search, "value")} placeholder="Search products..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"> </div> <!-- View and Sort Options --> <div class="flex items-center space-x-3"> ${renderComponent($$result3, "ViewToggle", $$ViewToggle, { "options": [
    { value: "grid", label: "Grid", icon: "grid" },
    { value: "list", label: "List", icon: "list" }
  ], "activeOption": viewMode, "onChange": (value) => updateUrlParams({ view: value }) })} ${renderComponent($$result3, "SortSelect", $$SortSelect, { "options": sortOptions, "selected": sortParam, "onChange": (value) => updateUrlParams({ sort: value }) })} </div> </div> <!-- Advanced Filters (collapsible) --> <details class="mt-4"> <summary class="cursor-pointer text-blue-600 font-medium mb-3">Advanced Filters</summary> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md"> <!-- Company Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Companies</label> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "options": companyOptions, "selected": selectedCompanies, "name": "companies", "onChange": (values) => {
    document.querySelector('input[name="companies"]').value = values.join(",");
  } })} <input type="hidden" name="companies"${addAttribute(selectedCompanies.join(","), "value")}> </div> <!-- Therapeutic Areas Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Therapeutic Areas</label> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "options": therapeuticAreas, "selected": selectedTAs, "name": "tas", "onChange": (values) => {
    document.querySelector('input[name="tas"]').value = values.join(",");
  } })} <input type="hidden" name="tas"${addAttribute(selectedTAs.join(","), "value")}> </div> <!-- Product Stage Filter --> <div> <label class="block text-sm font-medium text-gray-700 mb-1">Development Stage</label> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "options": stageOptions, "selected": selectedStages, "name": "stages", "onChange": (values) => {
    document.querySelector('input[name="stages"]').value = values.join(",");
  } })} <input type="hidden" name="stages"${addAttribute(selectedStages.join(","), "value")}> </div> </div> <!-- Filter Action Buttons --> <div class="flex justify-end mt-4 space-x-2"> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "primary" }, { "default": ($$result4) => renderTemplate`Apply Filters` })} ${renderComponent($$result3, "Button", $$Button, { "type": "button", "variant": "outline", "onClick": () => {
    window.location.href = "/products";
  } }, { "default": ($$result4) => renderTemplate`
Reset
` })} </div> </details> <!-- Maintain view and sort in form submission --> <input type="hidden" name="view"${addAttribute(viewMode, "value")}> <input type="hidden" name="sort"${addAttribute(sortParam, "value")}> </form> </div> ` })} </div> <!-- Results Count --> <div class="mb-4"> <p class="text-sm text-gray-600">
Showing <span class="font-medium">${filteredProducts.length}</span> products
</p> </div> <!-- Products Results --> ${filteredProducts.length === 0 ? renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-8 text-center"> <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <h3 class="mt-2 text-lg font-medium text-gray-900">No products found</h3> <p class="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p> <div class="mt-6"> ${renderComponent($$result3, "Button", $$Button, { "href": "/products", "variant": "primary" }, { "default": ($$result4) => renderTemplate`
Reset Filters
` })} </div> </div> ` })}` : renderTemplate`<div${addAttribute(`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`, "class")}> ${filteredProducts.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "product": product, "company": companyMap.get(product.companyId), "therapeuticAreaNames": productTaNames.get(product.id) || [], "view": viewMode })}`)} </div>`} <!-- Data Source Indicator --> <div class="mt-8"> ${renderComponent($$result2, "DataSourceVisualizer", $$DataSourceVisualizer, {})} </div> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/products/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/products/index.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/products/index.astro";
const $$url = "/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
