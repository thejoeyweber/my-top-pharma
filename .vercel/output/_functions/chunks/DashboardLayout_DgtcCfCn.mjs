import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as renderSlot } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from './Layout_Dw75zG_e.mjs';
import { $ as $$Header, a as $$Breadcrumb, b as $$Footer } from './Breadcrumb_D0ZprVJI.mjs';
import { $ as $$Sidebar } from './Sidebar_B_N98Kyo.mjs';

const $$Astro = createAstro();
const $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const {
    title,
    description,
    ogImage,
    currentPath = Astro2.url.pathname,
    breadcrumbs = [],
    showDevTools = false,
    sidebarOpen = false
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "ogImage": ogImage, "showDevTools": showDevTools }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "currentPath": currentPath })} ${maybeRenderHead()}<div class="flex flex-1 flex-grow pt-16">  ${renderComponent($$result2, "Sidebar", $$Sidebar, { "currentPath": currentPath, "isOpen": sidebarOpen })}  <div class="flex-1 transition-all duration-300 w-full lg:pl-64"> <main class="px-4 sm:px-6 lg:px-8 py-6">  ${breadcrumbs.length > 0 && renderTemplate`<div class="mb-6"> ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "items": breadcrumbs })} </div>`}  <div class="max-w-full mx-auto"> ${renderSlot($$result2, $$slots["default"])} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/templates/DashboardLayout.astro", void 0);

export { $$DashboardLayout as $ };
