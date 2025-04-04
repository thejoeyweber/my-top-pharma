import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Card } from './Card_yc1BfYIH.mjs';
import { $ as $$Button } from './Button_D9GGRmJN.mjs';
import { g as getProductImageUrl } from './assetUtils_P7u5uQke.mjs';

const $$Astro = createAstro();
const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProductCard;
  const {
    product,
    company = null,
    therapeuticAreaNames = []
  } = Astro2.props;
  const getStageName = (stage) => {
    const stageMap = {
      "preclinical": "Preclinical",
      "phase1": "Phase 1",
      "phase2": "Phase 2",
      "phase3": "Phase 3",
      "approved": "Approved",
      "market": "Marketed",
      "discontinued": "Discontinued"
    };
    return stageMap[stage] || stage;
  };
  const getStageColor = (stage) => {
    const colorMap = {
      "preclinical": "blue",
      "phase1": "indigo",
      "phase2": "purple",
      "phase3": "violet",
      "approved": "green",
      "market": "emerald",
      "discontinued": "red"
    };
    return colorMap[stage] || "gray";
  };
  const productImage = product.imageUrl || getProductImageUrl(product.name);
  return renderTemplate`${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-4"> <div class="flex flex-col h-full"> <!-- Product Header --> <div class="flex items-center mb-3"> <div class="flex-1"> <h3 class="text-lg font-medium text-gray-900">${product.name}</h3> ${company && renderTemplate`<p class="text-sm text-gray-500">${company.name}</p>`} </div> <div class="ml-2"> <span${addAttribute(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStageColor(product.stage)}-100 text-${getStageColor(product.stage)}-800`, "class")}> ${getStageName(product.stage)} </span> </div> </div> <!-- Product Image (if available) --> ${productImage && renderTemplate`<div class="bg-gray-50 rounded-md overflow-hidden mb-3 h-32 flex items-center justify-center"> <img${addAttribute(productImage, "src")}${addAttribute(`${product.name} product`, "alt")} class="max-h-full max-w-full object-contain"> </div>`} <!-- Product Description --> <p class="text-sm text-gray-600 line-clamp-3 mb-3 flex-grow">${product.description || "No description available."}</p> <!-- Therapeutic Areas --> ${therapeuticAreaNames.length > 0 && renderTemplate`<div class="mb-3"> <h4 class="text-xs text-gray-500 mb-1">Therapeutic Areas</h4> <div class="flex flex-wrap gap-1"> ${therapeuticAreaNames.slice(0, 3).map((area) => renderTemplate`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"> ${area} </span>`)} ${therapeuticAreaNames.length > 3 && renderTemplate`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
+${therapeuticAreaNames.length - 3} more
</span>`} </div> </div>`} <!-- Action Button --> <div class="mt-auto"> ${renderComponent($$result2, "Button", $$Button, { "href": `/products/${product.slug}`, "variant": "outline", "size": "sm", "fullWidth": true }, { "default": ($$result3) => renderTemplate`
View Details
` })} </div> </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/ProductCard.astro", void 0);

export { $$ProductCard as $ };
