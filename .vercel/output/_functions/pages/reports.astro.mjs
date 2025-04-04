import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute, u as unescapeHTML } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Reports", href: "/reports", isActive: true }
  ];
  const reports = [
    {
      id: "market-overview",
      title: "Market Overview",
      description: "Key metrics and trends in the pharmaceutical industry",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[color:var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>`,
      href: "/reports/market-overview"
    },
    {
      id: "therapeutic-areas",
      title: "Therapeutic Areas Analysis",
      description: "Distribution and trends across therapeutic areas",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[color:var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>`,
      href: "#",
      comingSoon: true
    },
    {
      id: "company-comparison",
      title: "Company Comparison",
      description: "Side-by-side comparison of multiple pharmaceutical companies",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[color:var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>`,
      href: "#",
      comingSoon: true
    },
    {
      id: "pipeline-outlook",
      title: "Pipeline Outlook",
      description: "Analysis of drug development pipelines and approval forecasts",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[color:var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>`,
      href: "#",
      comingSoon: true
    }
  ];
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Reports | Top Pharma", "description": "Access industry insights and data visualizations", "currentPath": "/reports", "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- Page header --> <div> <h1 class="text-2xl font-bold text-[color:var(--color-gray-900)]">Reports & Analysis</h1> <p class="mt-1 text-sm text-[color:var(--color-gray-500)]">
Explore interactive visualizations and insights about the pharmaceutical industry
</p> </div> <!-- Reports grid --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> ${reports.map((report) => renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <a${addAttribute(report.comingSoon ? "#" : report.href, "href")} class="block p-6 h-full"> <div class="flex items-start"> <div class="flex-shrink-0">${unescapeHTML(report.icon)}</div> <div class="ml-4"> <div class="flex items-center"> <h2 class="text-lg font-medium text-[color:var(--color-gray-900)]">${report.title}</h2> ${report.comingSoon && renderTemplate`<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[color:var(--color-gray-100)] text-[color:var(--color-gray-800)]">
Coming Soon
</span>`} </div> <p class="mt-1 text-sm text-[color:var(--color-gray-500)]"> ${report.description} </p> ${!report.comingSoon && renderTemplate`<div class="mt-4"> <span class="inline-flex items-center text-sm font-medium text-[color:var(--color-primary-600)] hover:text-[color:var(--color-primary-700)]">
View Report
<svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </span> </div>`} </div> </div> </a> ` })}`)} </div> <!-- Custom Report Builder (Coming Soon) --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <div class="flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[color:var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path> </svg> <div class="ml-4"> <h2 class="text-lg font-medium text-[color:var(--color-gray-900)]">Custom Report Builder</h2> <p class="mt-1 text-sm text-[color:var(--color-gray-500)]">
Build custom reports with your own data filters and visualizations
</p> <div class="mt-4"> ${renderComponent($$result3, "Button", $$Button, { "variant": "outline", "disabled": true }, { "default": ($$result4) => renderTemplate`
Coming Soon
` })} </div> </div> </div> </div> ` })} </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/reports/index.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/reports/index.astro";
const $$url = "/reports";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
