import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Card } from './Card_yc1BfYIH.mjs';

const $$Astro = createAstro();
const $$WebsiteCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$WebsiteCard;
  const {
    website,
    companyName = "",
    therapeuticAreaNames = []
    // Use empty array as default 
  } = Astro2.props;
  const formatUrl = (url) => {
    if (!url) return "";
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  };
  const getWebsiteDetailUrl = () => {
    if (!website.slug) {
      console.error(`Website is missing slug: ${website.url}`);
    }
    return `/websites/${website.slug}`;
  };
  return renderTemplate`${renderComponent($$result, "Card", $$Card, { "class": "h-full" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-4 flex flex-col h-full"> <div class="mb-3"> <h3 class="text-lg font-semibold text-gray-900 mb-1">${website.title}</h3> <a${addAttribute(website.url, "href")} target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 hover:underline"> ${formatUrl(website.url)} </a> </div> ${companyName && renderTemplate`<div class="mb-3"> <span class="text-xs font-medium text-gray-500">Company</span> <p class="text-sm font-medium text-gray-800">${companyName}</p> </div>`} <p class="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">${website.description || "No description available"}</p> <div class="mt-auto"> ${therapeuticAreaNames.length > 0 && renderTemplate`<div class="flex flex-wrap gap-1 mb-3"> ${therapeuticAreaNames.slice(0, 3).map((area) => renderTemplate`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"> ${area} </span>`)} ${therapeuticAreaNames.length > 3 && renderTemplate`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
+${therapeuticAreaNames.length - 3} </span>`} </div>`} <div class="text-right"> <a${addAttribute(getWebsiteDetailUrl(), "href")} class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
View Details
</a> </div> </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/WebsiteCard.astro", void 0);

export { $$WebsiteCard as $ };
