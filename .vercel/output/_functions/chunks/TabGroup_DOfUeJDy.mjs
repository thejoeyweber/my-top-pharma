import { c as createComponent, a as createAstro, m as maybeRenderHead, e as addAttribute, f as renderScript, u as unescapeHTML, b as renderTemplate } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$TabGroup = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TabGroup;
  const {
    tabs,
    activeTab,
    ariaLabel = "Content tabs",
    tabPanelId = "tab-content",
    class: className = "",
    useHash = true,
    fullWidth = false
  } = Astro2.props;
  const tabGroupId = `tabgroup-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["tab-group border-b border-gray-200", className], "class:list")}${addAttribute(tabGroupId, "data-tab-group")}${addAttribute(useHash, "data-use-hash")}${addAttribute(tabPanelId, "data-tab-panel-id")}> <nav${addAttribute([
    "flex -mb-px overflow-x-auto",
    fullWidth ? "w-full" : "space-x-8"
  ], "class:list")}${addAttribute(ariaLabel, "aria-label")} role="tablist"> ${tabs.map((tab) => {
    const isActive = activeTab === tab.id;
    const isDisabled = tab.disabled === true;
    return renderTemplate`<a${addAttribute(`tab-${tab.id}`, "id")}${addAttribute(useHash ? `#${tab.id}` : `javascript:void(0)`, "href")}${addAttribute([
      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
      fullWidth && "flex-1 justify-center",
      isActive ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
      isDisabled && "opacity-50 cursor-not-allowed pointer-events-none"
    ], "class:list")}${addAttribute(`${tabPanelId}-${tab.id}`, "aria-controls")}${addAttribute(isActive ? "true" : "false", "aria-selected")}${addAttribute(isDisabled ? "true" : "false", "aria-disabled")} role="tab"${addAttribute(isActive ? "0" : "-1", "tabindex")}${addAttribute(tab.id, "data-tab-id")}> ${tab.icon && renderTemplate`<span class="tab-icon">${unescapeHTML(tab.icon)}</span>`} <span class="tab-label">${tab.label}</span> </a>`;
  })} </nav> </div> ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/TabGroup.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/TabGroup.astro", void 0);

export { $$TabGroup as $ };
