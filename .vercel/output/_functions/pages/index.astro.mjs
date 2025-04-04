import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, d as renderSlot, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Dw75zG_e.mjs';
import { $ as $$Header, a as $$Breadcrumb, b as $$Footer } from '../chunks/Breadcrumb_D0ZprVJI.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { f as formatMarketCap } from '../chunks/stringUtils_BwXTwp-s.mjs';
import { s as supabase } from '../chunks/supabase_C3b6n6m6.mjs';
import { d as dbCompanyToCompany } from '../chunks/Company_c_JEsIwc.mjs';
import { d as dbProductToProduct } from '../chunks/Product_D6fkeiyM.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description,
    ogImage,
    currentPath = Astro2.url.pathname,
    breadcrumbs = [],
    hasHero = false,
    showDevTools = false
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "ogImage": ogImage, "showDevTools": showDevTools }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "currentPath": currentPath })} ${hasHero && renderTemplate`${maybeRenderHead()}<div class="w-full z-10"> ${renderSlot($$result2, $$slots["hero"])} </div>`}<main class="flex-grow"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">  ${breadcrumbs.length > 0 && renderTemplate`<div class="mb-6"> ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "items": breadcrumbs })} </div>`} ${renderSlot($$result2, $$slots["default"])} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/templates/BaseLayout.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const [
    { count: companiesCount },
    { count: productsCount },
    { count: websitesCount },
    { count: therapeuticAreasCount }
  ] = await Promise.all([
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("websites").select("*", { count: "exact", head: true }),
    supabase.from("therapeutic_areas").select("*", { count: "exact", head: true })
  ]);
  const { data: dbFeaturedCompanies, error: companiesError } = await supabase.from("companies").select("*").order("name").limit(3);
  if (companiesError) {
    console.error("Error fetching featured companies:", companiesError);
  }
  const featuredCompanies = (dbFeaturedCompanies || []).map(dbCompanyToCompany);
  const { data: dbTrendingProducts, error: productsError } = await supabase.from("products").select("*, companies(name)").eq("stage", "market").order("updated_at", { ascending: false }).limit(4);
  if (productsError) {
    console.error("Error fetching trending products:", productsError);
  }
  const trendingProducts = (dbTrendingProducts || []).map((dbProduct) => {
    const product = dbProductToProduct(dbProduct);
    return {
      ...product,
      company: dbProduct.companies?.name || "Unknown"
    };
  });
  const { data: dbRecentWebsites, error: websitesError } = await supabase.from("websites").select("*, companies(name)").order("updated_at", { ascending: false }).limit(3);
  if (websitesError) {
    console.error("Error fetching recent websites:", websitesError);
  }
  (dbRecentWebsites || []).map((website) => ({
    id: website.id,
    domain: website.domain,
    company: website.companies?.name || "Unknown",
    category: website.category,
    lastUpdated: website.updated_at ? new Date(website.updated_at).toLocaleDateString() : "Unknown",
    screenshotUrl: website.screenshot_url
  }));
  const { data: therapeuticAreasData } = await supabase.from("therapeutic_areas").select("id, name").order("name").limit(6);
  const therapeuticAreas = (therapeuticAreasData || []).map((area) => ({
    id: area.id,
    name: area.name,
    slug: area.id,
    // Using ID as slug for now
    count: Math.floor(Math.random() * 150) + 50
    // Placeholder count, replace with real count when available
  }));
  const formatNumber = (num) => {
    return num ? `${num.toLocaleString()}+` : "0+";
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Top Pharma - Pharmaceutical Industry Directory", "description": "Discover and explore pharmaceutical companies, products, and websites in one comprehensive directory.", "currentPath": "/", "hasHero": true }, { "default": ($$result2) => renderTemplate`    ${maybeRenderHead()}<div class="bg-white py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-2 gap-5 sm:grid-cols-4"> <div class="text-center"> <p class="text-4xl font-bold text-primary-600">${formatNumber(companiesCount)}</p> <p class="mt-2 text-sm font-medium text-gray-500">Companies</p> </div> <div class="text-center"> <p class="text-4xl font-bold text-primary-600">${formatNumber(productsCount)}</p> <p class="mt-2 text-sm font-medium text-gray-500">Products</p> </div> <div class="text-center"> <p class="text-4xl font-bold text-primary-600">${formatNumber(websitesCount)}</p> <p class="mt-2 text-sm font-medium text-gray-500">Websites</p> </div> <div class="text-center"> <p class="text-4xl font-bold text-primary-600">${formatNumber(therapeuticAreasCount)}</p> <p class="mt-2 text-sm font-medium text-gray-500">Therapeutic Areas</p> </div> </div> </div> </div>  <div class="bg-gray-50 py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h2 class="text-3xl font-bold text-gray-900">Featured Companies</h2> <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
Explore some of the leading pharmaceutical companies in our directory.
</p> </div> <div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${featuredCompanies.map((company) => renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4"> <span class="text-xl font-bold text-primary-600">${company.name.charAt(0)}</span> </div> <h3 class="text-xl font-semibold text-gray-900">${company.name}</h3> </div> <p class="text-gray-600 mb-4 flex-grow">${company.description}</p> <div class="border-t border-gray-200 pt-4 mt-auto"> <dl class="grid grid-cols-2 gap-x-4 gap-y-2"> <dt class="text-sm font-medium text-gray-500">Headquarters</dt> <dd class="text-sm text-gray-900">${company.headquarters}</dd> <dt class="text-sm font-medium text-gray-500">Market Cap</dt> <dd class="text-sm text-gray-900">${formatMarketCap(company.marketCap)}</dd> </dl> <div class="mt-4 flex flex-wrap gap-2"> ${company.therapeuticAreas.map((area) => renderTemplate`<span class="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"> ${area} </span>`)} </div> <div class="mt-6"> ${renderComponent($$result3, "Button", $$Button, { "href": `/companies/${company.slug}`, "variant": "outline", "size": "sm", "class": "w-full" }, { "default": ($$result4) => renderTemplate`
View Profile
` })} </div> </div> ` })}`)} </div> <div class="mt-12 text-center"> ${renderComponent($$result2, "Button", $$Button, { "href": "/companies", "variant": "secondary" }, { "default": ($$result3) => renderTemplate`
View All Companies
` })} </div> </div> </div>  <div class="bg-white py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h2 class="text-3xl font-bold text-gray-900">Trending Products</h2> <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
Popular pharmaceutical products making an impact in the industry.
</p> </div> <div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${trendingProducts.map((product) => renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <div class="flex justify-between mb-2"> <h3 class="text-lg font-semibold text-gray-900">${product.name}</h3> <span${addAttribute([
    "text-xs px-2.5 py-0.5 rounded-full",
    product.status === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  ], "class:list")}> ${product.status} </span> </div> <p class="text-sm text-gray-500 mb-3">${product.company} • ${product.year}</p> <p class="text-gray-600">${product.description}</p> <div class="mt-4"> ${renderComponent($$result3, "Button", $$Button, { "href": `/products/${product.slug}`, "variant": "outline", "size": "sm" }, { "default": ($$result4) => renderTemplate`View Details` })} </div> </div> ` })}`)} </div> <div class="mt-12 text-center"> ${renderComponent($$result2, "Button", $$Button, { "href": "/products", "variant": "secondary" }, { "default": ($$result3) => renderTemplate`
View All Products
` })} </div> </div> </div>  <div class="bg-gray-50 py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h2 class="text-3xl font-bold text-gray-900">Therapeutic Areas</h2> <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
Browse pharmaceutical companies and products by therapeutic area.
</p> </div> <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> ${therapeuticAreas.map((area) => renderTemplate`<a${addAttribute(`/therapeutic-areas/${area.slug}`, "href")} class="group"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="flex justify-between items-center p-6"> <h3 class="text-lg font-medium text-gray-900 group-hover:text-primary-600">${area.name}</h3> <span class="bg-primary-50 text-primary-700 text-sm font-medium px-2.5 py-0.5 rounded-full"> ${area.count} </span> </div> ` })} </a>`)} </div> <div class="mt-12 text-center"> ${renderComponent($$result2, "Button", $$Button, { "href": "/therapeutic-areas", "variant": "secondary" }, { "default": ($$result3) => renderTemplate`
View All Therapeutic Areas
` })} </div> </div> </div>  <div class="bg-primary-700 py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h2 class="text-3xl font-bold text-white">Ready to explore the pharmaceutical landscape?</h2> <p class="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
Create an account to save your searches, follow companies, and receive updates on the latest developments.
</p> <div class="mt-8 flex justify-center gap-4"> ${renderComponent($$result2, "Button", $$Button, { "href": "/register", "size": "lg" }, { "default": ($$result3) => renderTemplate`
Sign Up for Free
` })} ${renderComponent($$result2, "Button", $$Button, { "href": "/about", "variant": "outline", "size": "lg", "class": "bg-white/10 border-white/20 text-white hover:bg-white/20" }, { "default": ($$result3) => renderTemplate`
Learn More
` })} </div> </div> </div> </div> `, "hero": ($$result2) => renderTemplate`<div class="relative overflow-hidden"> <!-- Animated background gradient --> <div class="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 animate-gradient"></div> <!-- Morphing blob shapes - Made more prominent --> <div class="morph-blob animate-morph animate-wave bg-gradient-to-br from-primary-600/70 to-primary-400/70" style="width: 550px; height: 550px; top: -120px; right: -120px; z-index: 2;"></div> <div class="morph-blob animate-morph animate-wave animate-float-reverse bg-gradient-to-br from-secondary-500/60 to-secondary-300/60" style="width: 650px; height: 650px; bottom: -220px; left: -120px; animation-delay: -4s; z-index: 1;"></div> <div class="morph-blob animate-morph animate-wave animate-glow bg-gradient-to-r from-fuchsia-500/50 to-pink-500/50" style="width: 400px; height: 400px; top: 20%; right: 15%; animation-delay: -8s; z-index: 3;"></div> <div class="morph-blob animate-morph animate-wave bg-gradient-to-r from-secondary-600/50 to-teal-400/50" style="width: 380px; height: 380px; top: 55%; left: 8%; animation-delay: -12s; z-index: 2;"></div> <!-- Rotating gradient overlay --> <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-900/5 to-transparent opacity-30 animate-rotate-slow"></div> <!-- Animated background shapes - Enhanced with more shapes, colors and animations --> <div class="bg-shape animate-float animate-glow" style="width: 350px; height: 350px; background: rgba(99, 102, 241, 0.4); top: -120px; left: 10%; animation-delay: 0s;"></div> <div class="bg-shape animate-float-reverse" style="width: 450px; height: 450px; background: rgba(79, 70, 229, 0.3); bottom: -180px; right: 5%; animation-delay: -3s;"></div> <div class="bg-shape animate-float" style="width: 200px; height: 200px; background: rgba(165, 180, 252, 0.3); top: 40%; left: 60%; animation-delay: -6s;"></div> <div class="bg-shape animate-float-reverse animate-glow" style="width: 250px; height: 250px; background: rgba(224, 231, 255, 0.2); top: 30%; left: 20%; animation-delay: -2s;"></div> <!-- Added teal shapes --> <div class="bg-shape animate-float-reverse" style="width: 180px; height: 180px; background: rgba(45, 212, 191, 0.3); top: 15%; right: 25%; animation-delay: -4s;"></div> <div class="bg-shape animate-float animate-glow" style="width: 220px; height: 220px; background: rgba(20, 184, 166, 0.25); bottom: 10%; left: 40%; animation-delay: -7s;"></div> <!-- Added fuchsia/pink accent --> <div class="bg-shape animate-pulse-slow" style="width: 150px; height: 150px; background: rgba(219, 39, 119, 0.2); top: 60%; right: 15%; animation-delay: -1s;"></div> <div class="bg-shape animate-pulse-slow animate-glow" style="width: 100px; height: 100px; background: rgba(236, 72, 153, 0.15); top: 25%; left: 30%; animation-delay: -5s;"></div> <!-- Additional smaller shapes for more depth --> <div class="bg-shape animate-float" style="width: 80px; height: 80px; background: rgba(243, 232, 255, 0.2); top: 70%; left: 15%; animation-delay: -8s;"></div> <div class="bg-shape animate-float-reverse" style="width: 120px; height: 120px; background: rgba(14, 165, 233, 0.15); top: 20%; right: 40%; animation-delay: -9s;"></div> <div class="bg-shape animate-pulse-slow" style="width: 60px; height: 60px; background: rgba(232, 121, 249, 0.2); bottom: 30%; right: 30%; animation-delay: -3.5s;"></div> <!-- Light effect overlay --> <div class="absolute inset-0 bg-gradient-to-t from-transparent to-primary-900/30 backdrop-blur-[2px]"></div> <!-- Hero content with glassmorphism - increased top padding --> <div class="relative z-10"> <div class="max-w-7xl mx-auto pt-36 pb-36 px-4 sm:px-6 lg:px-8"> <div class="md:flex md:items-center md:justify-between"> <div class="md:w-1/2 md:pr-8"> <h1 class="text-4xl md:text-5xl font-display font-bold tracking-tight text-white drop-shadow-md">
The Pharmaceutical Industry at Your Fingertips
</h1> <p class="mt-4 text-lg md:text-xl text-white/90 drop-shadow">
Discover, track, and analyze pharmaceutical companies, their products, and digital presence in one comprehensive directory.
</p> <div class="mt-10 flex flex-wrap gap-4"> ${renderComponent($$result2, "Button", $$Button, { "href": "/companies", "size": "lg", "class": "shadow-lg" }, { "default": ($$result3) => renderTemplate`
Explore Companies
` })} ${renderComponent($$result2, "Button", $$Button, { "href": "/products", "variant": "outline", "size": "lg", "class": "bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-lg" }, { "default": ($$result3) => renderTemplate`
Browse Products
` })} </div> </div> <div class="mt-10 md:mt-0 md:w-1/2"> <div class="glass-card p-8 shadow-xl backdrop-blur-md border border-white/20"> <div class="relative"> <label for="hero-search" class="sr-only">Search</label> <!-- Updated search input with button position like the reference --> <div class="relative"> <input type="text" name="search" id="hero-search" class="glass-input block w-full border-0 py-4 px-4 pr-[6.5rem] text-white placeholder:text-white/70 focus:ring-2 focus:ring-inset focus:ring-white/50 bg-white/10 rounded-md" placeholder="Search companies, products, or therapeutic areas..."> <button type="button" class="absolute right-1 top-1 bottom-1 flex items-center justify-center gap-x-1.5 px-4 sm:px-5 py-3 text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors rounded-md shadow-md"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> <span class="hidden sm:inline">Search</span> </button> </div> </div> <div class="mt-5 flex flex-wrap gap-3"> <span class="text-sm font-medium text-white/80">Popular:</span> <a href="/search?q=oncology" class="text-sm text-white hover:text-primary-200 underline decoration-white/30 hover:decoration-primary-200 transition-colors">Oncology</a> <a href="/search?q=pfizer" class="text-sm text-white hover:text-primary-200 underline decoration-white/30 hover:decoration-primary-200 transition-colors">Pfizer</a> <a href="/search?q=vaccines" class="text-sm text-white hover:text-primary-200 underline decoration-white/30 hover:decoration-primary-200 transition-colors">Vaccines</a> <a href="/search?q=rare+diseases" class="text-sm text-white hover:text-primary-200 underline decoration-white/30 hover:decoration-primary-200 transition-colors">Rare Diseases</a> </div> </div> </div> </div> </div> </div> <!-- Enhanced shimmer animation overlay with direction variation --> <div class="absolute inset-0 pointer-events-none"> <div class="absolute inset-0 animate-shimmer opacity-30"></div> <div class="absolute inset-0 animate-shimmer opacity-20" style="animation-delay: -5s; transform: rotate(30deg);"></div> </div> </div>` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/index.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
