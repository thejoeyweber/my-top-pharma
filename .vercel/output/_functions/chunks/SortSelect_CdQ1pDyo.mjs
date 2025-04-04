import { c as createComponent, a as createAstro, m as maybeRenderHead, e as addAttribute, b as renderTemplate } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$SortSelect = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SortSelect;
  const {
    options,
    label = "Sort by",
    name = "sort",
    id = "sort-select",
    selected = "",
    class: className = "",
    onChange
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["sort-select flex flex-col md:flex-row md:items-center gap-2", className], "class:list")}> ${label && renderTemplate`<label${addAttribute(id, "for")} class="text-sm font-medium text-gray-700 whitespace-nowrap">${label}:</label>`} <div class="relative"> <select${addAttribute(id, "id")}${addAttribute(name, "name")}${addAttribute(`window.location.href = this.options[this.selectedIndex].dataset.url`, "onchange")} class="block w-full rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"${addAttribute(label, "aria-label")}> ${options.map((option) => {
    const url = onChange ? onChange(option.value) : `?${name}=${option.value}`;
    return renderTemplate`<option${addAttribute(option.value, "value")}${addAttribute(option.value === selected, "selected")}${addAttribute(option.disabled, "disabled")}${addAttribute(url, "data-url")}> ${option.label} </option>`;
  })} </select> <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"> <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </div> </div> </div>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/SortSelect.astro", void 0);

export { $$SortSelect as $ };
