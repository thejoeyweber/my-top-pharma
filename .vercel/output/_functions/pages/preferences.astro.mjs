import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
export { renderers } from '../renderers.mjs';

const $$Preferences = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Preferences", href: "/preferences", isActive: true }
  ];
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Account Preferences | Top Pharma", "description": "Manage your account preferences", "currentPath": "/preferences", "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- Page header --> <div> <h1 class="text-2xl font-bold text-gray-900">Account Preferences</h1> <p class="mt-1 text-sm text-gray-500">
Manage your account settings and preferences
</p> </div> <!-- Content area --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-12 text-center"> <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> <h3 class="mt-4 text-lg font-medium text-gray-900">Preferences Feature</h3> <p class="mt-2 text-gray-500 max-w-md mx-auto">
This feature is currently being developed. Soon you'll be able to manage your account preferences.
</p> <div class="mt-6"> ${renderComponent($$result3, "Button", $$Button, { "href": "/dashboard", "variant": "primary" }, { "default": ($$result4) => renderTemplate`
Return to Dashboard
` })} </div> </div> ` })} </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/preferences.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/preferences.astro";
const $$url = "/preferences";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Preferences,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
