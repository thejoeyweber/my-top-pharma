import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Button } from './Button_D9GGRmJN.mjs';
import { $ as $$Card } from './Card_yc1BfYIH.mjs';
import { f as formatMarketCap } from './stringUtils_BwXTwp-s.mjs';

const $$Astro = createAstro();
const $$CompanyCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CompanyCard;
  const {
    company,
    view = "grid",
    isCompact = false,
    therapeuticAreaNames = []
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-4"> <div class="flex flex-col h-full"> <!-- Company Header --> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3 overflow-hidden"> ${company.logoUrl ? renderTemplate`<img${addAttribute(company.logoUrl, "src")}${addAttribute(`${company.name} logo`, "alt")} class="w-10 h-10 object-contain">` : renderTemplate`<span class="text-xl font-bold text-primary-600">${company.name.charAt(0)}</span>`} </div> <div> <h3 class="text-lg font-medium text-gray-900">${company.name}</h3> <p class="text-sm text-gray-500">${company.headquarters || "Location not available"}</p> </div> </div> <!-- Company Description --> <p class="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">${company.description}</p> <!-- Company Information --> <div class="border-t border-gray-200 pt-3 mt-auto"> <div class="flex justify-between items-end"> <div> <span class="text-xs font-medium text-gray-500">Market Cap</span> <p class="text-base font-medium text-gray-900">${formatMarketCap(company.marketCap)}</p> </div> <!-- Therapeutic Areas --> <div class="text-right"> ${therapeuticAreaNames.length > 0 && renderTemplate`<div class="flex flex-wrap justify-end gap-1 mb-2"> ${therapeuticAreaNames.slice(0, 2).map((area) => renderTemplate`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"> ${area} </span>`)} ${therapeuticAreaNames.length > 2 && renderTemplate`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
+${therapeuticAreaNames.length - 2} </span>`} </div>`} ${renderComponent($$result2, "Button", $$Button, { "href": `/companies/${company.slug}`, "variant": "primary", "size": "sm" }, { "default": ($$result3) => renderTemplate`View Profile` })} </div> </div> </div> </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/CompanyCard.astro", void 0);

export { $$CompanyCard as $ };
