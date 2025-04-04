import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
export { renderers } from '../renderers.mjs';

const $$Notifications = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Notifications", href: "/notifications", isActive: true }
  ];
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Notifications | Top Pharma", "description": "View and manage your notifications", "currentPath": "/notifications", "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- Page header --> <div> <h1 class="text-2xl font-bold text-gray-900">Notifications</h1> <p class="mt-1 text-sm text-gray-500">
View and manage your notifications
</p> </div> <!-- Content area --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-12 text-center"> <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path> </svg> <h3 class="mt-4 text-lg font-medium text-gray-900">Notifications Feature</h3> <p class="mt-2 text-gray-500 max-w-md mx-auto">
This feature is currently being developed. Soon you'll be able to view and manage your notifications.
</p> <div class="mt-6"> ${renderComponent($$result3, "Button", $$Button, { "href": "/dashboard", "variant": "primary" }, { "default": ($$result4) => renderTemplate`
Return to Dashboard
` })} </div> </div> ` })} </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/notifications.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/notifications.astro";
const $$url = "/notifications";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Notifications,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
