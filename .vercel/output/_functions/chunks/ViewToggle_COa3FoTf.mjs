import { c as createComponent, a as createAstro, m as maybeRenderHead, e as addAttribute, f as renderScript, b as renderTemplate, u as unescapeHTML } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro$1 = createAstro();
const $$MultiSelect = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$MultiSelect;
  const {
    options,
    selected = [],
    name,
    label,
    placeholder = "Select options...",
    class: className = "",
    onChange
  } = Astro2.props;
  const selectedCount = selected.length;
  const displayText = selectedCount > 0 ? `${selectedCount} selected` : placeholder;
  options.filter((option) => selected.includes(option.value)).map((option) => option.label);
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["multi-select relative", className], "class:list")}> ${label && renderTemplate`<label class="block text-sm font-medium text-gray-700 mb-1">${label}</label>`} <details class="relative w-full"> <summary class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-500 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"> <span class="block truncate"> ${displayText} </span> <span class="pointer-events-none ml-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"> <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </span> </summary> <div class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"> ${options.length > 10 && renderTemplate`<div class="sticky top-0 z-10 bg-white px-2 py-1.5"> <div class="relative"> <div class="absolute inset-y-0 left-0 flex items-center pl-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> <input type="text" class="filter-input w-full rounded-md border-0 py-1.5 pl-8 pr-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary-600" placeholder="Search options..."> </div> </div>`} <div class="max-h-56 overflow-auto py-1"> ${options.map((option) => renderTemplate`<label class="relative flex items-center py-2 px-3 cursor-pointer select-none hover:bg-primary-50 option-item"${addAttribute(option.value, "data-value")}${addAttribute(option.label, "data-label")}> <input type="checkbox"${addAttribute(`${name}[]`, "name")}${addAttribute(option.value, "value")}${addAttribute(selected.includes(option.value), "checked")} class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"${addAttribute(onChange && `(function() { 
                const values = Array.from(document.querySelectorAll('input[name="${name}[]"]:checked')).map(el => el.value);
                (${onChange.toString()})(values);
              })()`, "onchange")}> <span class="ml-2 truncate">${option.label}</span> </label>`)} </div> </div> </details> </div> ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/MultiSelect.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/MultiSelect.astro", void 0);

const $$Astro = createAstro();
const $$ViewToggle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ViewToggle;
  const defaultOptions = [
    {
      value: "grid",
      label: "Grid view",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>`
    },
    {
      value: "list",
      label: "List view",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
    </svg>`
    }
  ];
  const {
    options = defaultOptions,
    activeOption = "grid",
    name = "view",
    class: className = "",
    onChange
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["view-toggle", className], "class:list")}> <span class="sr-only">View options</span> <div class="inline-flex rounded-md shadow-sm" role="group"> ${options.map((option, index) => renderTemplate`<a${addAttribute(onChange ? onChange(option.value) : `?${name}=${option.value}`, "href")}${addAttribute([
    "view-toggle-btn py-1.5 px-3 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-primary-500 focus:outline-none",
    index === 0 ? "rounded-l-md" : "",
    index === options.length - 1 ? "rounded-r-md" : "",
    option.value === activeOption ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
    index > 0 && option.value !== activeOption ? "-ml-px" : ""
  ], "class:list")}${addAttribute(option.label, "aria-label")}${addAttribute(option.label, "title")}${addAttribute(option.value === activeOption ? "page" : void 0, "aria-current")}> <span>${unescapeHTML(option.icon)}</span> </a>`)} </div> </div>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/ViewToggle.astro", void 0);

export { $$ViewToggle as $, $$MultiSelect as a };
