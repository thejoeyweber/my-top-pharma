import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../../chunks/Card_yc1BfYIH.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const auditTools = [
    {
      id: "companies",
      title: "Companies Data",
      description: "Compare company data between mock JSON and database sources",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.089a.75.75 0 0 0-1.172-.93l-2.25 2.828-1.24-1.24a.75.75 0 1 0-1.06 1.061l1.5 1.5a.75.75 0 0 0 1.06 0l3-3.75a.75.75 0 0 0 .162-.538Z" clip-rule="evenodd" /></svg>',
      href: "/admin/audit/companies",
      status: "active"
    },
    {
      id: "database-connection",
      title: "Database Connection",
      description: "Monitor and toggle between local and remote Supabase instances",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" /><path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" /><path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" /><path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" /></svg>',
      href: "/admin/data-feeds/connection-test",
      status: "active"
    },
    {
      id: "products",
      title: "Products Data",
      description: "Compare product data between mock JSON and database sources",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" /><path fill-rule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clip-rule="evenodd" /></svg>',
      href: "/admin/audit/products",
      status: "coming-soon"
    },
    {
      id: "feature-flags",
      title: "Feature Flags",
      description: "Manage feature flags for progressive rollout of database features",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clip-rule="evenodd" /></svg>',
      href: "/admin/audit/feature-flags",
      status: "active"
    }
  ];
  const statusColors = {
    "active": "bg-green-100 text-green-800",
    "coming-soon": "bg-blue-100 text-blue-800",
    "planned": "bg-gray-100 text-gray-800"
  };
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Data Audit | Admin | Top Pharma" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100"> <header class="bg-white shadow"> <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> <div class="flex items-center"> <a href="/admin" class="mr-2 text-gray-400 hover:text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path> </svg> </a> <h1 class="text-2xl font-bold text-gray-900">Data Audit Tools</h1> </div> </div> </header> <main class="py-6"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="mb-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-lg font-medium mb-2">Data Migration Audit</h2> <p class="text-gray-500">
These tools help verify data quality and consistency during the phased migration 
                from static JSON mock data to dynamic database-driven content.
</p> </div> ` })} </div> <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"> ${auditTools.map((tool) => renderTemplate`<a${addAttribute(tool.status === "active" ? tool.href : "#", "href")}${addAttribute(tool.status !== "active" ? "cursor-not-allowed opacity-70" : "", "class")}> ${renderComponent($$result2, "Card", $$Card, { "hover": tool.status === "active" }, { "default": ($$result3) => renderTemplate` <div class="px-4 py-5 sm:p-6"> <div class="flex justify-between items-start"> <div class="flex-shrink-0 rounded-md bg-primary-50 p-3"> <span class="text-primary-600">${unescapeHTML(tool.icon)}</span> </div> <span${addAttribute(`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[tool.status]}`, "class")}> ${tool.status === "active" ? "Active" : "Coming Soon"} </span> </div> <div class="mt-4"> <h3 class="text-lg font-medium text-gray-900">${tool.title}</h3> <p class="mt-2 text-sm text-gray-500">${tool.description}</p> </div> </div> ` })} </a>`)} </div> </div> </main> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/audit/index.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/audit/index.astro";
const $$url = "/admin/audit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
