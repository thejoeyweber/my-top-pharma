import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as renderSlot } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from './Layout_Dw75zG_e.mjs';
import { $ as $$Header, a as $$Breadcrumb, b as $$Footer } from './Breadcrumb_D0ZprVJI.mjs';
import { $ as $$Sidebar } from './Sidebar_B_N98Kyo.mjs';
import { $ as $$DataSourceVisualizer } from './DataSourceVisualizer_CXj8ahGU.mjs';

const $$Astro = createAstro();
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const {
    title = "Admin Dashboard",
    description = "MyTopPharma Administration Dashboard",
    ogImage,
    currentPath = Astro2.url.pathname,
    breadcrumbs = [],
    showDataSource = true,
    showDevTools = false
  } = Astro2.props;
  currentPath.startsWith("/admin");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "ogImage": ogImage, "showDevTools": showDevTools }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "currentPath": currentPath })} ${maybeRenderHead()}<div class="flex flex-1 flex-grow">  ${renderComponent($$result2, "Sidebar", $$Sidebar, { "currentPath": currentPath })}  <div class="flex-1 transition-all duration-300 w-full lg:pl-64"> <main class="px-4 sm:px-6 lg:px-8 py-6">  <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg mb-6 p-4 text-white shadow-md"> <h1 class="text-2xl font-bold">${title}</h1> ${description && renderTemplate`<p class="text-sm opacity-90 mt-1">${description}</p>`} </div>  ${showDataSource && renderTemplate`<div class="mb-6"> ${renderComponent($$result2, "DataSourceVisualizer", $$DataSourceVisualizer, {})} </div>`}  ${breadcrumbs.length > 0 && renderTemplate`<div class="mb-6"> ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "items": breadcrumbs })} </div>`}  <div class="bg-white rounded-lg shadow-sm p-6"> ${renderSlot($$result2, $$slots["default"])} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
