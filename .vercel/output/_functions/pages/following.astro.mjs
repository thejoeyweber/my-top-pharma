import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
import { $ as $$TabGroup } from '../chunks/TabGroup_DOfUeJDy.mjs';
export { renderers } from '../renderers.mjs';

const $$Following = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Following", href: "/following", isActive: true }
  ];
  const tabs = [
    { id: "companies", label: "Companies" },
    { id: "products", label: "Products" },
    { id: "therapeutic-areas", label: "Therapeutic Areas" }
  ];
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Following | Top Pharma", "description": "View and manage the companies, products, and therapeutic areas you're following", "currentPath": "/following", "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- Page header --> <div> <h1 class="text-2xl font-bold text-gray-900">Following</h1> <p class="mt-1 text-sm text-gray-500">
View and manage the companies, products, and therapeutic areas you're following
</p> </div> <!-- Tabs for different following types --> <div> ${renderComponent($$result2, "TabGroup", $$TabGroup, { "tabs": tabs, "activeTab": "companies", "ariaLabel": "Following categories", "tabPanelId": "following-content" })} <!-- Content area --> <div class="mt-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-12 text-center"> <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path> </svg> <h3 class="mt-4 text-lg font-medium text-gray-900">Following Feature</h3> <p class="mt-2 text-gray-500 max-w-md mx-auto">
This feature is currently being developed. Soon you'll be able to follow companies, products, and therapeutic areas.
</p> <div class="mt-6"> ${renderComponent($$result3, "Button", $$Button, { "href": "/companies", "variant": "primary" }, { "default": ($$result4) => renderTemplate`
Browse Companies
` })} </div> </div> ` })} </div> </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/following.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/following.astro";
const $$url = "/following";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Following,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
