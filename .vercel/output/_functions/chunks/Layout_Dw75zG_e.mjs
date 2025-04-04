import { c as createComponent, a as createAstro, e as addAttribute, f as renderScript, b as renderTemplate, r as renderComponent, h as renderHead, d as renderSlot } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
/* empty css                         */
import 'clsx';

const $$Astro$1 = createAstro();
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/node_modules/astro/components/ClientRouter.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Top Pharma",
    description = "Explore pharmaceutical companies, products, and industry insights",
    ogImage = "/images/og-image.jpg",
    bodyClass = "bg-gray-50 text-gray-900 antialiased",
    showDevTools = false
  } = Astro2.props;
  const pageTitle = title !== "Top Pharma" ? `${title} | Top Pharma` : "Top Pharma - Pharmaceutical Industry Insights";
  return renderTemplate`<html lang="en" class="h-full"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description"${addAttribute(description, "content")}><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><title>${pageTitle}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet">${renderComponent($$result, "ViewTransitions", $$ClientRouter, {})}${renderHead()}</head> <body${addAttribute(`h-full flex flex-col min-h-screen ${bodyClass}`, "class")}> ${renderSlot($$result, $$slots["default"])}  </body></html>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/layouts/Layout.astro", void 0);

export { $$Layout as $, $$ClientRouter as a };
