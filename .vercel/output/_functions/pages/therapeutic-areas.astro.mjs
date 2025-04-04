import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute, f as renderScript } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
import { $ as $$SortSelect } from '../chunks/SortSelect_CdQ1pDyo.mjs';
import { $ as $$DataSourceVisualizer } from '../chunks/DataSourceVisualizer_CXj8ahGU.mjs';
import { s as supabase } from '../chunks/supabase_C3b6n6m6.mjs';
import { d as dbTherapeuticAreaToTherapeuticArea } from '../chunks/TherapeuticArea_BVI-zbe5.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$TherapeuticAreaCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TherapeuticAreaCard;
  const {
    therapeuticArea,
    companyCount = 0,
    productCount = 0,
    websiteCount = 0
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Card", $$Card, { "class": "h-full" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-4 flex flex-col h-full"> <h3 class="text-lg font-semibold text-gray-900 mb-2">${therapeuticArea.name}</h3> <p class="text-sm text-gray-600 mb-4 flex-grow line-clamp-3"> ${therapeuticArea.description || "No description available"} </p> <div class="mt-auto border-t border-gray-200 pt-3"> <div class="grid grid-cols-3 gap-2"> <div class="text-center"> <p class="text-sm font-medium text-gray-900">${companyCount}</p> <p class="text-xs text-gray-500">Companies</p> </div> <div class="text-center"> <p class="text-sm font-medium text-gray-900">${productCount}</p> <p class="text-xs text-gray-500">Products</p> </div> <div class="text-center"> <p class="text-sm font-medium text-gray-900">${websiteCount}</p> <p class="text-xs text-gray-500">Websites</p> </div> </div> <div class="mt-3 text-right"> <a${addAttribute(`/therapeutic-areas/${therapeuticArea.slug}`, "href")} class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
View Details
</a> </div> </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/TherapeuticAreaCard.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const url = new URL(Astro2.request.url);
  const params = url.searchParams;
  const sortParam = params.get("sort") || "name_asc";
  const search = params.get("search") || "";
  const minCompanies = params.get("minCompanies") ? parseInt(params.get("minCompanies")) : 0;
  const minProducts = params.get("minProducts") ? parseInt(params.get("minProducts")) : 0;
  const [sortField, sortDirection] = sortParam.split("_");
  let query = supabase.from("therapeutic_areas").select("*");
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (sortField === "name") {
    query = query.order("name", { ascending: sortDirection === "asc" });
  }
  const { data: dbTherapeuticAreas, error: taError } = await query;
  if (taError) {
    console.error("Error fetching therapeutic areas:", taError);
  }
  const therapeuticAreas = (dbTherapeuticAreas || []).map(dbTherapeuticAreaToTherapeuticArea);
  const { data: allCompanyRelations, error: companyRelError } = await supabase.from("company_therapeutic_areas").select("company_id, therapeutic_area_id");
  if (companyRelError) {
    console.error("Error fetching company-therapeutic area relations:", companyRelError);
  }
  const { data: allProductRelations, error: productRelError } = await supabase.from("product_therapeutic_areas").select("product_id, therapeutic_area_id");
  if (productRelError) {
    console.error("Error fetching product-therapeutic area relations:", productRelError);
  }
  const { data: allWebsites, error: websiteError } = await supabase.from("websites").select("id, company_id");
  if (websiteError) {
    console.error("Error fetching websites:", websiteError);
  }
  const companyRelationsByTA = /* @__PURE__ */ new Map();
  const productRelationsByTA = /* @__PURE__ */ new Map();
  (allCompanyRelations || []).forEach((relation) => {
    const taId = relation.therapeutic_area_id;
    const companyIds = companyRelationsByTA.get(taId) || [];
    companyRelationsByTA.set(taId, [...companyIds, relation.company_id]);
  });
  (allProductRelations || []).forEach((relation) => {
    const taId = relation.therapeutic_area_id;
    const productIds = productRelationsByTA.get(taId) || [];
    productRelationsByTA.set(taId, [...productIds, relation.product_id]);
  });
  const websitesByCompany = /* @__PURE__ */ new Map();
  (allWebsites || []).forEach((website) => {
    if (website.company_id) {
      const count = websitesByCompany.get(website.company_id) || 0;
      websitesByCompany.set(website.company_id, count + 1);
    }
  });
  const areaStats = therapeuticAreas.map((area) => {
    const companyIds = companyRelationsByTA.get(area.id) || [];
    const companyCount = companyIds.length;
    const productIds = productRelationsByTA.get(area.id) || [];
    const productCount = productIds.length;
    let websiteCount = 0;
    companyIds.forEach((companyId) => {
      websiteCount += websitesByCompany.get(companyId) || 0;
    });
    return {
      id: area.id,
      area,
      companyCount,
      productCount,
      websiteCount
    };
  });
  let filteredAreaStats = areaStats;
  if (minCompanies > 0) {
    filteredAreaStats = filteredAreaStats.filter((stats) => stats.companyCount >= minCompanies);
  }
  if (minProducts > 0) {
    filteredAreaStats = filteredAreaStats.filter((stats) => stats.productCount >= minProducts);
  }
  if (sortField !== "name") {
    filteredAreaStats.sort((a, b) => {
      let comparison = 0;
      if (sortField === "companies") {
        comparison = a.companyCount - b.companyCount;
      } else if (sortField === "products") {
        comparison = a.productCount - b.productCount;
      } else if (sortField === "websites") {
        comparison = a.websiteCount - b.websiteCount;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }
  const sortOptions = [
    { value: "name_asc", label: "Name (A to Z)" },
    { value: "name_desc", label: "Name (Z to A)" },
    { value: "companies_desc", label: "Most Companies" },
    { value: "products_desc", label: "Most Products" },
    { value: "websites_desc", label: "Most Websites" }
  ];
  const updateUrlParams = (updates) => {
    const newUrl = new URL(Astro2.request.url);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newUrl.searchParams.delete(key);
      } else {
        newUrl.searchParams.set(key, value);
      }
    });
    return newUrl.pathname + newUrl.search;
  };
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Therapeutic Areas" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Added visual header that connects to detail page design --> <div class="mb-6 overflow-hidden"> <div class="flex border border-gray-100 rounded-lg shadow-sm overflow-hidden"> <div class="w-3 bg-gradient-to-b from-amber-500 to-amber-600"></div> <div class="p-6 flex items-center"> <div class="bg-white p-3 rounded-full shadow-sm mr-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-600" fill="currentColor" viewBox="0 0 612 612"> <g> <path d="M380.406,254.483c-7.043,3.727-14.33,6.947-21.83,9.607c-16.626,5.899-34.283,9.08-52.575,9.08
                  c-33.516,0-66.005,7.368-96.563,21.901c-7.149,3.4-14.112,7.16-20.886,11.26c-4.681,2.834-9.263,5.844-13.756,9.005
                  c-4.306,3.03-8.526,6.205-12.652,9.531c-10.795,8.703-20.974,18.401-30.467,29.075c-45.35,50.992-70.326,118.535-70.326,190.186
                  v47.975c0,10.989,8.908,19.897,19.897,19.897h26.529c10.988,0,19.897-8.908,19.897-19.897v-31.137h14.923h14.923h296.963h14.923
                  h14.923v31.137c0,10.989,8.908,19.897,19.897,19.897h26.529c10.988,0,19.897-8.908,19.897-19.897v-47.975
                  c0-71.652-24.975-139.194-70.325-190.186c-9.493-10.674-19.672-20.372-30.467-29.075c-11.004,7.412-22.507,13.983-34.475,19.675
                  c-11.429,5.436-23.101,9.98-34.975,13.637c23.809,12.596,44.8,31.04,61.573,53.719h-18.929h-20.193H209.144H188.95h-18.929
                  c16.774-22.679,37.764-41.123,61.573-53.719c7.044-3.726,14.33-6.947,21.83-9.607c16.626-5.899,34.283-9.08,52.576-9.08
                  c33.516,0,66.005-7.368,96.563-21.901c7.149-3.4,14.112-7.16,20.886-11.26c4.681-2.834,9.263-5.844,13.756-9.005
                  c4.306-3.03,8.525-6.204,12.652-9.531c10.795-8.703,20.975-18.401,30.467-29.075c45.35-50.992,70.325-118.535,70.325-190.186
                  V19.897C550.649,8.908,541.741,0,530.752,0h-26.529c-10.988,0-19.897,8.908-19.897,19.897v31.071h-14.923h-14.923H157.519h-14.923
                  h-14.923V19.897C127.674,8.908,118.765,0,107.777,0H81.248C70.259,0,61.351,8.908,61.351,19.897v48.638
                  c0,71.652,24.975,139.194,70.325,190.186c9.493,10.674,19.672,20.372,30.467,29.075c11.004-7.412,22.507-13.983,34.475-19.676
                  c11.429-5.435,23.101-9.98,34.975-13.637c-24.064-12.731-45.249-31.435-62.111-54.448h18.853h20.09h195.146h20.09h18.854
                  C425.655,223.048,404.471,241.752,380.406,254.483z M170.966,471.59h270.069h15.944h15.763c3.174,9.575,5.739,19.49,7.64,29.687
                  H465.2h-15.245H162.046h-15.245H131.62c1.901-10.196,4.466-20.111,7.64-29.687h15.763H170.966z M441.312,140.344H170.688h-15.922
                  h-15.748c-3.138-9.578-5.671-19.493-7.536-29.687h15.181h15.23h288.216h15.23h15.182c-1.866,10.194-4.399,20.108-7.536,29.687
                  h-15.748H441.312z"></path> </g> </svg> </div> <div> <h1 class="text-2xl font-bold text-gray-900">Therapeutic Areas</h1> <p class="text-gray-600 text-sm">Find medical and therapeutic domains across the pharmaceutical industry</p> </div> </div> </div> </div> <!-- Filter Bar --> <div class="mb-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <form id="filter-form" method="get" action="/therapeutic-areas"> <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"> <!-- Search input --> <div class="w-full md:w-1/3"> <input type="text" id="search" name="search"${addAttribute(search, "value")} placeholder="Search therapeutic areas..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"> </div> <!-- Sort Options --> <div class="flex items-center space-x-3"> ${renderComponent($$result3, "SortSelect", $$SortSelect, { "options": sortOptions, "selected": sortParam, "onChange": (value) => updateUrlParams({ sort: value }) })} </div> </div> <!-- Advanced Filters (collapsible) --> <details class="mt-4"> <summary class="cursor-pointer text-blue-600 font-medium mb-3">Advanced Filters</summary> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md"> <!-- Min Companies Filter --> <div> <label for="minCompanies" class="block text-sm font-medium text-gray-700 mb-1">Min Companies</label> <input type="number" id="minCompanies" name="minCompanies" min="0"${addAttribute(minCompanies, "value")} class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"> </div> <!-- Min Products Filter --> <div> <label for="minProducts" class="block text-sm font-medium text-gray-700 mb-1">Min Products</label> <input type="number" id="minProducts" name="minProducts" min="0"${addAttribute(minProducts, "value")} class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"> </div> </div> <!-- Filter Action Buttons --> <div class="flex justify-end mt-4 space-x-2"> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "primary" }, { "default": ($$result4) => renderTemplate`Apply Filters` })} ${renderComponent($$result3, "Button", $$Button, { "type": "button", "variant": "outline", "onClick": () => {
    window.location.href = "/therapeutic-areas";
  } }, { "default": ($$result4) => renderTemplate`
Reset
` })} </div> </details> <!-- Maintain sort in form submission --> <input type="hidden" name="sort"${addAttribute(sortParam, "value")}> </form> </div> ` })} </div> <!-- Results Count --> <div class="mb-4"> <p class="text-sm text-gray-600">
Showing <span class="font-medium">${filteredAreaStats.length}</span> therapeutic areas
</p> </div> <!-- Therapeutic Areas Results --> ${filteredAreaStats.length === 0 ? renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-8 text-center"> <svg class="mx-auto h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 612 612"> <g> <path d="M380.406,254.483c-7.043,3.727-14.33,6.947-21.83,9.607c-16.626,5.899-34.283,9.08-52.575,9.08
                c-33.516,0-66.005,7.368-96.563,21.901c-7.149,3.4-14.112,7.16-20.886,11.26c-4.681,2.834-9.263,5.844-13.756,9.005
                c-4.306,3.03-8.526,6.205-12.652,9.531c-10.795,8.703-20.974,18.401-30.467,29.075c-45.35,50.992-70.326,118.535-70.326,190.186
                v47.975c0,10.989,8.908,19.897,19.897,19.897h26.529c10.988,0,19.897-8.908,19.897-19.897v-31.137h14.923h14.923h296.963h14.923
                h14.923v31.137c0,10.989,8.908,19.897,19.897,19.897h26.529c10.988,0,19.897-8.908,19.897-19.897v-47.975
                c0-71.652-24.975-139.194-70.325-190.186c-9.493-10.674-19.672-20.372-30.467-29.075c-11.004,7.412-22.507,13.983-34.475,19.675
                c-11.429,5.436-23.101,9.98-34.975,13.637c23.809,12.596,44.8,31.04,61.573,53.719h-18.929h-20.193H209.144H188.95h-18.929
                c16.774-22.679,37.764-41.123,61.573-53.719c7.044-3.726,14.33-6.947,21.83-9.607c16.626-5.899,34.283-9.08,52.576-9.08
                c33.516,0,66.005-7.368,96.563-21.901c7.149-3.4,14.112-7.16,20.886-11.26c4.681-2.834,9.263-5.844,13.756-9.005
                c4.306-3.03,8.525-6.204,12.652-9.531c10.795-8.703,20.975-18.401,30.467-29.075c45.35-50.992,70.325-118.535,70.325-190.186
                V19.897C550.649,8.908,541.741,0,530.752,0h-26.529c-10.988,0-19.897,8.908-19.897,19.897v31.071h-14.923h-14.923H157.519h-14.923
                h-14.923V19.897C127.674,8.908,118.765,0,107.777,0H81.248C70.259,0,61.351,8.908,61.351,19.897v48.638
                c0,71.652,24.975,139.194,70.325,190.186c9.493,10.674,19.672,20.372,30.467,29.075c11.004-7.412,22.507-13.983,34.475-19.676
                c11.429-5.435,23.101-9.98,34.975-13.637c-24.064-12.731-45.249-31.435-62.111-54.448h18.853h20.09h195.146h20.09h18.854
                C425.655,223.048,404.471,241.752,380.406,254.483z M170.966,471.59h270.069h15.944h15.763c3.174,9.575,5.739,19.49,7.64,29.687
                H465.2h-15.245H162.046h-15.245H131.62c1.901-10.196,4.466-20.111,7.64-29.687h15.763H170.966z M441.312,140.344H170.688h-15.922
                h-15.748c-3.138-9.578-5.671-19.493-7.536-29.687h15.181h15.23h288.216h15.23h15.182c-1.866,10.194-4.399,20.108-7.536,29.687
                h-15.748H441.312z"></path> </g> </svg> <h3 class="mt-2 text-lg font-medium text-gray-900">No therapeutic areas found</h3> <p class="mt-1 text-sm text-gray-500">Try adjusting your filters or adding new therapeutic areas.</p> <div class="mt-6"> ${renderComponent($$result3, "Button", $$Button, { "href": "/therapeutic-areas", "variant": "primary" }, { "default": ($$result4) => renderTemplate`
Reset Filters
` })} </div> </div> ` })}` : renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"> ${filteredAreaStats.map((stats) => renderTemplate`${renderComponent($$result2, "TherapeuticAreaCard", $$TherapeuticAreaCard, { "therapeuticArea": stats.area, "companyCount": stats.companyCount, "productCount": stats.productCount, "websiteCount": stats.websiteCount })}`)} </div>`} <!-- Data Source Indicator --> <div class="mt-8"> ${renderComponent($$result2, "DataSourceVisualizer", $$DataSourceVisualizer, {})} </div> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/therapeutic-areas/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/therapeutic-areas/index.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/therapeutic-areas/index.astro";
const $$url = "/therapeutic-areas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
