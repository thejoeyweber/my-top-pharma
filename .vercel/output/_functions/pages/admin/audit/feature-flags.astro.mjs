import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../../../chunks/Card_yc1BfYIH.mjs';
export { renderers } from '../../../renderers.mjs';

const $$FeatureFlags = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Feature Flags | Admin | Top Pharma" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100"> <header class="bg-white shadow"> <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> <div class="flex items-center"> <a href="/admin/audit" class="mr-2 text-gray-400 hover:text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path> </svg> </a> <h1 class="text-2xl font-bold text-gray-900">Feature Flags</h1> </div> </div> </header> <main class="py-6"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-lg font-medium mb-4">Environment-Based Configuration</h2> <p class="text-gray-700 mb-4">
Feature flags are now managed through environment variables instead of this interface.
</p> <p class="text-gray-700">
Please refer to the project documentation for details on configuring your environment.
</p> <div class="mt-4"> <a href="/admin/data-feeds/connection-test" class="text-blue-600 hover:text-blue-800">
Test Database Connection →
</a> </div> </div> ` })} </div> </main> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/audit/feature-flags.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/audit/feature-flags.astro";
const $$url = "/admin/audit/feature-flags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$FeatureFlags,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
