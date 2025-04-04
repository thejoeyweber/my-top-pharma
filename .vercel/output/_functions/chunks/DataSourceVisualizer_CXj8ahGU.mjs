import { c as createComponent, a as createAstro, m as maybeRenderHead, e as addAttribute, f as renderScript, r as renderComponent, F as Fragment, b as renderTemplate, u as unescapeHTML } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
/* empty css                                   */

const $$Astro = createAstro();
const $$DataSourceVisualizer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DataSourceVisualizer;
  const {
    contentType,
    class: className = "",
    title = "Data Source:",
    minimal = false,
    collapsible = true,
    initiallyExpanded = true
  } = Astro2.props;
  const dataSourceType = "supabase";
  const instanceId = "https://ocglnockxnvmqjwzuqfb.supabase.co";
  const badgeId = `datasource-vis-${Math.random().toString(36).substring(2, 10)}`;
  const badgeColorClass = "bg-emerald-100 border-emerald-300 text-emerald-800";
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
</svg>`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(badgeId, "id")}${addAttribute([
    "datasource-visualizer relative rounded border shadow-sm p-1 font-sans text-xs",
    badgeColorClass,
    className,
    { "inline-flex items-center": !minimal }
  ], "class:list")}${addAttribute(dataSourceType, "data-source-type")}${addAttribute((!initiallyExpanded).toString(), "data-collapsed")} data-astro-cid-xnu43uyz> ${!minimal && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-xnu43uyz": true }, { "default": ($$result2) => renderTemplate` <span class="flex items-center datasource-badge" data-astro-cid-xnu43uyz>${unescapeHTML(iconSvg)}</span> ${collapsible && renderTemplate`<button class="toggle-btn ml-1.5 mr-0.5 focus:outline-none text-opacity-60 hover:text-opacity-100" title="Toggle details" aria-label="Toggle data source details" data-astro-cid-xnu43uyz> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-xnu43uyz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-xnu43uyz></path> </svg> </button>`}<div${addAttribute(["data-label flex items-center ml-0.5", { "hidden": !initiallyExpanded && collapsible }], "class:list")} data-astro-cid-xnu43uyz> <span class="font-medium mr-1" data-astro-cid-xnu43uyz>${title}</span> <span class="source-name" data-astro-cid-xnu43uyz>${dataSourceType}</span> ${contentType && renderTemplate`<span class="ml-1 text-opacity-80" data-astro-cid-xnu43uyz>[${contentType}]</span>`} ${renderTemplate`<span class="text-opacity-70 ml-1.5 text-[10px] truncate max-w-[100px]" data-astro-cid-xnu43uyz>${instanceId}</span>`} </div> ` })}`} ${minimal && renderTemplate`<div class="w-2 h-2 rounded-full"${addAttribute(`Data Source: ${dataSourceType}${contentType ? ` (${contentType})` : ""}`, "title")} data-astro-cid-xnu43uyz></div>`} </div> ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/DataSourceVisualizer.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/DataSourceVisualizer.astro", void 0);

export { $$DataSourceVisualizer as $ };
