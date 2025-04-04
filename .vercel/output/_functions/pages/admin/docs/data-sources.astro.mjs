import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_Bl5WGr-R.mjs';
export { renderers } from '../../../renderers.mjs';

const $$DataSources = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin" },
    { label: "Documentation", href: "/admin/docs" },
    { label: "Data Sources", href: "/admin/docs/data-sources", isActive: true }
  ];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Data Sources", "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto py-8 px-4"> <h1 class="text-3xl font-bold mb-6">Data Sources</h1> <p>This documentation is under construction.</p> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/docs/data-sources.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/docs/data-sources.astro";
const $$url = "/admin/docs/data-sources";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DataSources,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
