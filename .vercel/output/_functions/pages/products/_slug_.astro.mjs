import { c as createComponent, a as createAstro, r as renderComponent, f as renderScript, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../../chunks/Button_D9GGRmJN.mjs';
import { $ as $$FollowButton } from '../../chunks/FollowButton_-wbK4Pn3.mjs';
import { $ as $$TabGroup } from '../../chunks/TabGroup_DOfUeJDy.mjs';
import { s as supabase } from '../../chunks/supabase_C3b6n6m6.mjs';
import { d as dbProductToProduct } from '../../chunks/Product_D6fkeiyM.mjs';
import { d as dbCompanyToCompany } from '../../chunks/Company_c_JEsIwc.mjs';
import { d as dbWebsiteToWebsite } from '../../chunks/Website__PBY8XlA.mjs';
import { d as dbTherapeuticAreaToTherapeuticArea } from '../../chunks/TherapeuticArea_BVI-zbe5.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  const { data: dbProducts } = await supabase.from("products").select("id, slug, name");
  return (dbProducts || []).map((product) => ({
    params: {
      slug: product.slug
    },
    props: { productId: product.id }
  }));
}
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
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
  const { slug } = Astro2.params;
  const { productId } = Astro2.props;
  let productResponse;
  if (productId) {
    productResponse = await supabase.from("products").select("*").eq("id", productId).single();
  }
  if (!productResponse || productResponse.error || !productResponse.data) {
    productResponse = await supabase.from("products").select("*").eq("slug", slug).single();
    if (productResponse.error || !productResponse.data) {
      productResponse = await supabase.from("products").select("*").eq("id", slug).single();
    }
  }
  const { data: dbProduct, error: productError } = productResponse;
  if (productError || !dbProduct) {
    return Astro2.redirect("/products");
  }
  const product = dbProductToProduct(dbProduct);
  if (!product.approvals) {
    product.approvals = [];
  }
  const { data: dbCompany } = await supabase.from("companies").select("*").eq("id", product.companyId).single();
  const company = dbCompany ? dbCompanyToCompany(dbCompany) : null;
  const { data: productTARelations } = await supabase.from("product_therapeutic_areas").select("therapeutic_area_id").eq("product_id", slug);
  const therapeuticAreaIds = (productTARelations || []).map((rel) => rel.therapeutic_area_id);
  let therapeuticAreas = [];
  if (therapeuticAreaIds.length > 0) {
    const { data: dbTherapeuticAreas } = await supabase.from("therapeutic_areas").select("*").in("id", therapeuticAreaIds);
    therapeuticAreas = (dbTherapeuticAreas || []).map(dbTherapeuticAreaToTherapeuticArea);
  }
  const { data: productWebsites } = await supabase.from("product_websites").select("website_id").eq("product_id", slug);
  const websiteIds = (productWebsites || []).map((rel) => rel.website_id);
  let websites = [];
  if (websiteIds.length > 0) {
    const { data: dbWebsites } = await supabase.from("websites").select("*").in("id", websiteIds);
    websites = (dbWebsites || []).map(dbWebsiteToWebsite);
  }
  const { data: relatedProductsRelations } = await supabase.from("product_therapeutic_areas").select("product_id").in("therapeutic_area_id", therapeuticAreaIds).neq("product_id", slug).limit(5);
  const relatedProductIds = [...new Set((relatedProductsRelations || []).map((rel) => rel.product_id))];
  if (relatedProductIds.length > 0) {
    const { data: dbRelatedProducts } = await supabase.from("products").select("*").in("id", relatedProductIds);
    (dbRelatedProducts || []).map(dbProductToProduct);
  }
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.name, href: `/products/${product.slug}`, active: true }
  ];
  websites.reduce((acc, website) => {
    const category = website.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(website);
    return acc;
  }, {});
  const activeTab = "overview";
  const tabs = [
    { id: "overview", label: "Overview", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    { id: "websites", label: "Official Websites", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>' },
    { id: "regulatory", label: "Regulatory", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>' },
    { id: "timeline", label: "Development Timeline", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>' },
    { id: "patents", label: "Patents", icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' }
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": `${product.name} | Top Pharma`, "description": `Detailed information about ${product.name} (${product.genericName || "no generic name"}), a ${product.moleculeType} for ${product.indications.join(", ")}`, "currentPath": `/products/${product.slug}`, "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- Product Header Section - Updated to match company header structure --> <div class="relative"> <!-- Header Background Image --> <div class="h-48 w-full bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden shadow-md">  </div> <!-- Product Info Card --> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"> <div class="bg-white rounded-lg shadow-lg overflow-hidden -mt-24 mb-8"> <div class="p-6 sm:p-8"> <div class="flex flex-col md:flex-row items-start md:items-center"> <!-- Product Logo/Image --> <div class="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden mr-6 mb-4 md:mb-0"> ${product.imageUrl ? renderTemplate`<img${addAttribute(product.imageUrl, "src")}${addAttribute(product.name, "alt")} class="max-w-full max-h-full p-2">` : renderTemplate`<span class="text-3xl font-bold text-green-600">${product.name.charAt(0)}</span>`} </div> <!-- Product Basic Info --> <div class="flex-grow"> <div class="flex items-center justify-between flex-wrap"> <div> <h1 class="text-2xl font-bold text-gray-900 mr-4">${product.name}</h1> ${product.genericName && renderTemplate`<p class="text-gray-500 text-sm">${product.genericName}</p>`} </div> <div class="flex space-x-3 mt-2 md:mt-0"> ${product.website && renderTemplate`${renderComponent($$result2, "Button", $$Button, { "href": product.website.startsWith("http") ? product.website : `https://${product.website}`, "target": "_blank", "variant": "outline", "size": "sm" }, { "default": ($$result3) => renderTemplate` <span class="flex items-center"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg>
Website
</span> ` })}`} ${renderComponent($$result2, "FollowButton", $$FollowButton, { "entityId": product.id, "entityType": "product", "size": "sm" })} </div> </div> <div class="mt-2 flex flex-wrap items-center text-sm text-gray-500"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2"> ${getStageName(product.stage)} </span> ${product.moleculeType && renderTemplate`<span class="mr-4">${product.moleculeType}</span>`} </div> </div> </div> </div>  ${company && renderTemplate`<div class="bg-gray-50 px-6 sm:px-8 py-3 border-t border-gray-200"> <div class="flex items-center text-gray-700"> <span class="text-sm mr-2">Developed by:</span> <a${addAttribute(`/companies/${company.slug}`, "href")} class="text-primary-600 hover:text-primary-800 font-medium text-sm"> ${company.name} </a> </div> </div>`} </div> </div> </div> <!-- Tabs Navigation --> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"> ${renderComponent($$result2, "TabGroup", $$TabGroup, { "tabs": tabs, "activeTab": activeTab, "tabPanelId": "product-tab-content" })} <!-- Tab Content --> <div class="mt-6"> <!-- Overview Tab --> <div id="product-tab-content-overview" role="tabpanel" aria-labelledby="tab-overview" class="space-y-6"> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <!-- Key Metrics/Facts Column --> <div class="col-span-1"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-lg font-medium text-gray-900 mb-4">Key Facts</h3> <div class="space-y-4"> <div class="flex"> <div class="flex-shrink-0"> <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> </div> <div class="ml-3"> <p class="text-sm font-medium text-gray-500">Status</p> <p class="text-sm text-gray-900">${getStageName(product.stage)}</p> </div> </div> ${product.year && renderTemplate`<div class="flex"> <div class="flex-shrink-0"> <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div> <div class="ml-3"> <p class="text-sm font-medium text-gray-500">Year</p> <p class="text-sm text-gray-900">${product.year}</p> </div> </div>`} ${product.moleculeType && renderTemplate`<div class="flex"> <div class="flex-shrink-0"> <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path> </svg> </div> <div class="ml-3"> <p class="text-sm font-medium text-gray-500">Type</p> <p class="text-sm text-gray-900">${product.moleculeType}</p> </div> </div>`}  </div> </div> ` })} ${therapeuticAreas.length > 0 && renderTemplate`${renderComponent($$result2, "Card", $$Card, { "class": "mt-6" }, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-lg font-medium text-gray-900 mb-4">Therapeutic Areas</h3> <div class="flex flex-wrap gap-2"> ${therapeuticAreas.map((area) => renderTemplate`<a${addAttribute(`/therapeutic-areas/${area.slug}`, "href")} class="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800 hover:bg-blue-200"> ${area.name} </a>`)} </div> </div> ` })}`} </div> <!-- Product Description --> <div class="col-span-2"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-lg font-medium text-gray-900 mb-4">About ${product.name}</h3> ${product.description ? renderTemplate`<p class="text-gray-600">${product.description}</p>` : renderTemplate`<p class="text-gray-500 italic">No product description available</p>`} </div> ` })} <!-- Indications --> ${renderComponent($$result2, "Card", $$Card, { "class": "mt-6" }, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-lg font-medium text-gray-900 mb-4">Indications</h3> ${product.indications && product.indications.length > 0 ? renderTemplate`<ul class="list-disc pl-5 space-y-1 text-gray-700"> ${product.indications.map((indication) => renderTemplate`<li>${indication}</li>`)} </ul>` : renderTemplate`<p class="text-gray-500 italic">No indications listed.</p>`} </div> ` })} </div> </div> </div> <!-- Websites Tab --> <div id="product-tab-content-websites" role="tabpanel" aria-labelledby="tab-websites" class="space-y-6 hidden"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-lg font-medium text-gray-900 mb-4">Official Websites</h3> ${websites.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> ${websites.map((website) => renderTemplate`<div class="border border-gray-200 rounded-lg shadow-sm overflow-hidden"> <div class="p-4"> <div class="flex justify-between items-start"> <h3 class="font-medium text-gray-900">${website.domain}</h3> <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"> ${website.category} </span> </div> <div class="mt-2 flex justify-between items-center"> <a${addAttribute(`/websites/${website.slug}`, "href")} class="text-sm font-medium text-blue-600 hover:text-blue-800">
View details
</a> <a${addAttribute(`https://${website.domain}`, "href")} target="_blank" rel="noopener noreferrer" class="text-sm text-gray-500 hover:text-gray-700">
Visit site →
</a> </div> </div> </div>`)} </div>` : renderTemplate`<div class="text-center py-6"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path> </svg> <h3 class="mt-2 text-lg font-medium text-gray-900">No official websites found</h3> <p class="mt-1 text-gray-500">No official websites found for this product.</p> </div>`} </div> ` })} </div> <!-- Regulatory Tab --> <div id="product-tab-content-regulatory" role="tabpanel" aria-labelledby="tab-regulatory" class="space-y-6 hidden"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-lg font-medium text-gray-900 mb-4">Regulatory Information</h3> ${product.approvals && product.approvals.length > 0 ? renderTemplate`<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"> <table class="min-w-full divide-y divide-gray-300"> <thead class="bg-gray-50"> <tr> <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Region</th> <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Agency</th> <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th> <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th> <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Indication</th> </tr> </thead> <tbody class="divide-y divide-gray-200 bg-white"> ${product.approvals.map((approval) => renderTemplate`<tr> <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${approval.region}</td> <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${approval.agency}</td> <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"> ${approval.status} </span> </td> <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${formatDate(approval.date)}</td> <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${approval.indication}</td> </tr>`)} </tbody> </table> </div>` : renderTemplate`<div class="text-center py-6"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> <h3 class="mt-2 text-lg font-medium text-gray-900">No regulatory information</h3> <p class="mt-1 text-gray-500">No regulatory approvals or submissions found for this product.</p> </div>`} </div> ` })} </div> <!-- Development Timeline Tab --> <div id="product-tab-content-timeline" role="tabpanel" aria-labelledby="tab-timeline" class="space-y-6 hidden"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-lg font-medium text-gray-900 mb-4">Development Timeline</h3>  <div class="text-center py-6"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path> </svg> <h3 class="mt-2 text-lg font-medium text-gray-900">No development timeline</h3> <p class="mt-1 text-gray-500">Development timeline information is not available for this product.</p> </div> </div> ` })} </div> <!-- Patents Tab --> <div id="product-tab-content-patents" role="tabpanel" aria-labelledby="tab-patents" class="space-y-6 hidden"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-4"> <h3 class="text-lg font-medium text-gray-900 mb-4">Patent Information</h3>  <div class="text-center py-6"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h3 class="mt-2 text-lg font-medium text-gray-900">No patent information</h3> <p class="mt-1 text-gray-500">Patent information is not available for this product.</p> </div> </div> ` })} </div> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/products/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/products/[slug].astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/products/[slug].astro";
const $$url = "/products/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
