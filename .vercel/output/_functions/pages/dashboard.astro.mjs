import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { s as supabase } from '../chunks/supabase_C3b6n6m6.mjs';
export { renderers } from '../renderers.mjs';

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const fetchCounts = async () => {
    const { count: companyCount, error: companyError } = await supabase.from("companies").select("*", { count: "exact", head: true });
    if (companyError) {
      console.error("Error fetching company count:", companyError);
    }
    const { count: productCount, error: productError } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("stage", "market");
    if (productError) {
      console.error("Error fetching product count:", productError);
    }
    const { count: websiteCount, error: websiteError } = await supabase.from("websites").select("*", { count: "exact", head: true });
    if (websiteError) {
      console.error("Error fetching website count:", websiteError);
    }
    const { count: taCount, error: taError } = await supabase.from("therapeutic_areas").select("*", { count: "exact", head: true });
    if (taError) {
      console.error("Error fetching therapeutic area count:", taError);
    }
    return {
      companyCount: companyCount || 0,
      productCount: productCount || 0,
      websiteCount: websiteCount || 0,
      taCount: taCount || 0
    };
  };
  const fetchRecentActivity = async () => {
    const { data: recentCompanies, error: companyError } = await supabase.from("companies").select("id, name, updated_at").order("updated_at", { ascending: false }).limit(5);
    if (companyError) {
      console.error("Error fetching recent companies:", companyError);
    }
    const { data: recentProducts, error: productError } = await supabase.from("products").select("id, name, updated_at").order("updated_at", { ascending: false }).limit(5);
    if (productError) {
      console.error("Error fetching recent products:", productError);
    }
    return {
      recentCompanies: recentCompanies || [],
      recentProducts: recentProducts || []
    };
  };
  const counts = await fetchCounts();
  const activity = await fetchRecentActivity();
  const metrics = [
    {
      label: "Total Companies",
      value: counts.companyCount.toLocaleString(),
      change: "+12%",
      trend: "up"
    },
    {
      label: "Active Products",
      value: counts.productCount.toLocaleString(),
      change: "+8%",
      trend: "up"
    },
    {
      label: "Websites Indexed",
      value: counts.websiteCount.toLocaleString(),
      change: "+15%",
      trend: "up"
    },
    {
      label: "Therapeutic Areas",
      value: counts.taCount.toLocaleString(),
      change: "+3",
      trend: "up"
    }
  ];
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard", active: true }
  ];
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Dashboard | Top Pharma", "description": "Top Pharma dashboard with key metrics and industry insights", "currentPath": "/dashboard", "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- Page header --> <div> <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1> <p class="mt-1 text-sm text-gray-500">
Overview of pharmaceutical industry metrics and activity
</p> </div> <!-- Metrics cards --> <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"> ${metrics.map((metric) => renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="px-4 py-5 sm:p-6"> <div class="flex items-center"> <div class="flex-shrink-0 rounded-md bg-primary-50 p-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path> </svg> </div> <div class="ml-5 w-0 flex-1"> <dl> <dt class="text-sm font-medium text-gray-500 truncate"> ${metric.label} </dt> <dd> <div class="text-lg font-medium text-gray-900"> ${metric.value} </div> </dd> </dl> </div> </div> <div class="mt-3 text-sm flex items-center"> <span${addAttribute(`inline-flex items-center text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`, "class")}> ${metric.trend === "up" ? renderTemplate`<svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"> <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path> </svg>` : renderTemplate`<svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"> <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>`} <span class="ml-1"> ${metric.change} </span> </span> <span class="ml-2 text-gray-500">from previous month</span> </div> </div> ` })}`)} </div> <!-- Recent activity --> <h2 class="text-lg font-medium text-gray-900 mt-8">Recent Activity</h2> <div class="grid grid-cols-1 gap-5 sm:grid-cols-2"> <!-- Recent companies --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="px-4 py-5 sm:p-6"> <h3 class="text-base font-medium text-gray-900 mb-4">Recently Updated Companies</h3> <ul class="divide-y divide-gray-200"> ${activity.recentCompanies.map((company) => renderTemplate`<li class="py-3"> <div class="flex items-center justify-between"> <div> <a${addAttribute(`/companies/${company.slug}`, "href")} class="text-sm font-medium text-primary-600 hover:text-primary-900"> ${company.name} </a> <p class="text-xs text-gray-500">
Updated ${new Date(company.updated_at).toLocaleDateString()} </p> </div> <div> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Updated
</span> </div> </div> </li>`)} </ul> </div> ` })} <!-- Recent products --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="px-4 py-5 sm:p-6"> <h3 class="text-base font-medium text-gray-900 mb-4">Recently Updated Products</h3> <ul class="divide-y divide-gray-200"> ${activity.recentProducts.map((product) => renderTemplate`<li class="py-3"> <div class="flex items-center justify-between"> <div> <a${addAttribute(`/products/${product.slug}`, "href")} class="text-sm font-medium text-primary-600 hover:text-primary-900"> ${product.name} </a> <p class="text-xs text-gray-500">
Updated ${new Date(product.updated_at).toLocaleDateString()} </p> </div> <div> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
Product
</span> </div> </div> </li>`)} </ul> </div> ` })} </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/dashboard.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
