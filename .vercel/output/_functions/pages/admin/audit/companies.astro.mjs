import { c as createComponent, r as renderComponent, f as renderScript, b as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../../../chunks/Card_yc1BfYIH.mjs';
import { s as supabase } from '../../../chunks/supabase_C3b6n6m6.mjs';
import { d as dbCompanyToCompany } from '../../../chunks/Company_c_JEsIwc.mjs';
import { f as formatMarketCap } from '../../../chunks/stringUtils_BwXTwp-s.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Companies = createComponent(async ($$result, $$props, $$slots) => {
  const { data: dbData = [], error } = await supabase.from("companies").select("*").order("name");
  if (error) {
    console.error("Error fetching companies:", error);
  }
  const dbCompanies = (dbData || []).map(dbCompanyToCompany);
  const companySample = dbCompanies.slice(0, 10);
  const stats = {
    companyCount: dbCompanies.length,
    dataSource: "Supabase"
  };
  function formatNumber(num) {
    return num.toLocaleString();
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Companies Audit | Admin | Top Pharma" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100"> <header class="bg-white shadow"> <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> <div class="flex items-center"> <a href="/admin" class="mr-2 text-gray-400 hover:text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path> </svg> </a> <h1 class="text-2xl font-bold text-gray-900">Companies Data Audit</h1> </div> </div> </header> <main class="py-6"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <!-- Data Source Info --> <div class="mb-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-lg font-medium mb-4">Data Source Information</h2> <div class="flex items-center justify-between"> <div> <p class="text-sm text-gray-600">
Current data source: <span class="font-medium">${stats.dataSource}</span> </p> <p class="mt-1 text-xs text-gray-500">
Toggle between local and remote database using environment variables
</p> </div> </div> </div> ` })} </div> <!-- Data Stats --> <div class="mb-6"> <h2 class="text-lg font-medium mb-4">Data Stats</h2> <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-5"> <dt class="truncate text-sm font-medium text-gray-500">Company Count</dt> <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">${formatNumber(stats.companyCount)}</dd> </div> ` })} </div> </div> <!-- Company Data Table --> <div class="mb-8"> <h2 class="text-lg font-medium mb-4">Company Data Sample</h2> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-base font-medium mb-4">Database Companies (First 10)</h3> <div class="overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> <th scope="col" class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> <th scope="col" class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th> <th scope="col" class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${companySample.map((company) => renderTemplate`<tr> <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${company.name}</td> <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${company.tickerSymbol}</td> <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${formatMarketCap(company.marketCap * 1e9)}</td> </tr>`)} </tbody> </table> </div> </div> ` })} </div> </div> </main> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/audit/companies.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/audit/companies.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/audit/companies.astro";
const $$url = "/admin/audit/companies";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Companies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
