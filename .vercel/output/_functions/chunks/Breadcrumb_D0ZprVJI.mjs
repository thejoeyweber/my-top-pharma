import { c as createComponent, a as createAstro, r as renderComponent, m as maybeRenderHead, f as renderScript, e as addAttribute, b as renderTemplate, u as unescapeHTML } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Button } from './Button_D9GGRmJN.mjs';
import { a as $$ClientRouter } from './Layout_Dw75zG_e.mjs';
import 'clsx';

const $$Astro$1 = createAstro();
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const { currentPath = "/" } = Astro2.props;
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/companies", label: "Companies" },
    { href: "/products", label: "Products" },
    { href: "/websites", label: "Websites" },
    { href: "/therapeutic-areas", label: "Therapeutic Areas" }
  ];
  const isActive = (href) => {
    if (href === "/") {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };
  return renderTemplate`${renderComponent($$result, "ViewTransitions", $$ClientRouter, {})} ${maybeRenderHead()}<header class="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16 flex items-center shadow-sm"> <div class="max-w-full w-full mx-auto px-4"> <div class="flex justify-between items-center h-16"> <!-- Left side: Mobile menu button and logo --> <div class="flex items-center"> <!-- Mobile menu button --> <button type="button" id="sidebar-toggle" class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-2" aria-controls="sidebar" aria-expanded="false"> <span class="sr-only">Open sidebar</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path> </svg> </button> <!-- Logo with blue-purple gradient matching hero section --> <a href="/" class="hidden md:flex items-center"> <div class="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md px-3 py-1.5 flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-teal-400"> <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path> </svg> <span class="text-lg font-medium tracking-tight text-white"><span class="text-teal-400">t</span>op pharma</span> </div> </a> </div> <!-- Center: Navigation links --> <nav class="hidden lg:flex lg:items-center lg:justify-center"> <div class="flex space-x-1"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute([
    "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
    isActive(link.href) ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  ], "class:list")}${addAttribute(isActive(link.href) ? "page" : void 0, "aria-current")}> ${link.label} </a>`)} </div> </nav> <!-- Right side: Search and user actions --> <div class="flex items-center gap-2"> <!-- Search --> <div class="relative w-full max-w-xs hidden sm:block"> <input type="text" placeholder="Search..." class="w-full rounded-md border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"> <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-gray-400"> <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd"></path> </svg> </div> </div> <!-- Search button for mobile --> <button class="p-2 text-gray-600 rounded-md hover:bg-gray-50 sm:hidden"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"> <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd"></path> </svg> </button> <!-- Notifications --> <button class="p-2 text-gray-600 rounded-md hover:bg-gray-50 relative"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"> <path fill-rule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clip-rule="evenodd"></path> </svg> <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span> </button> <!-- User menu --> <div class="flex items-center"> ${renderComponent($$result, "Button", $$Button, { "href": "/login", "variant": "primary", "size": "sm", "class": "whitespace-nowrap px-3 py-1.5 text-sm" }, { "default": ($$result2) => renderTemplate`
Sign In
` })} </div> </div> </div> </div> </header> ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/organisms/Header.astro?astro&type=script&index=0&lang.ts")} <!-- Mobile sidebar backdrop overlay --> <div id="sidebar-overlay" class="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden hidden transition-opacity duration-300 ease-in-out"></div>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/organisms/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const footerNavigation = {
    solutions: [
      { name: "Company Directory", href: "/companies" },
      { name: "Product Database", href: "/products" },
      { name: "Website Index", href: "/websites" },
      { name: "Therapeutic Areas", href: "/therapeutic-areas" },
      { name: "Analytics", href: "/analytics" }
    ],
    support: [
      { name: "Documentation", href: "/docs" },
      { name: "Guides", href: "/guides" },
      { name: "API Status", href: "/api-status" }
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Partners", href: "/partners" }
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" }
    ]
  };
  const social = [
    {
      name: "Twitter",
      href: "#",
      icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-6 w-6" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>`
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-6 w-6" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>`
    }
  ];
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="bg-white border-t border-gray-200" aria-labelledby="footer-heading"> <h2 id="footer-heading" class="sr-only">Footer</h2> <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8"> <div class="xl:grid xl:grid-cols-3 xl:gap-8"> <div class="space-y-8 xl:col-span-1"> <div> <span class="text-primary-600 font-display font-bold text-xl">TopPharma</span> <p class="text-gray-500 text-base mt-2">
The comprehensive directory for pharmaceutical companies, products, and websites.
</p> </div> <div class="flex space-x-6"> ${social.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="text-gray-400 hover:text-gray-500"> <span class="sr-only">${item.name}</span> <div>${unescapeHTML(item.icon)}</div> </a>`)} </div> </div> <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2"> <div class="md:grid md:grid-cols-2 md:gap-8"> <div> <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3> <ul role="list" class="mt-4 space-y-4"> ${footerNavigation.solutions.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")} class="text-base text-gray-500 hover:text-gray-900"> ${item.name} </a> </li>`)} </ul> </div> <div class="mt-12 md:mt-0"> <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3> <ul role="list" class="mt-4 space-y-4"> ${footerNavigation.support.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")} class="text-base text-gray-500 hover:text-gray-900"> ${item.name} </a> </li>`)} </ul> </div> </div> <div class="md:grid md:grid-cols-2 md:gap-8"> <div> <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3> <ul role="list" class="mt-4 space-y-4"> ${footerNavigation.company.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")} class="text-base text-gray-500 hover:text-gray-900"> ${item.name} </a> </li>`)} </ul> </div> <div class="mt-12 md:mt-0"> <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3> <ul role="list" class="mt-4 space-y-4"> ${footerNavigation.legal.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")} class="text-base text-gray-500 hover:text-gray-900"> ${item.name} </a> </li>`)} </ul> </div> </div> </div> </div> <div class="mt-12 border-t border-gray-200 pt-8"> <p class="text-base text-gray-400 xl:text-center">
&copy; ${currentYear} TopPharma. All rights reserved.
</p> </div> </div> </footer>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/organisms/Footer.astro", void 0);

const $$Astro = createAstro();
const $$Breadcrumb = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const { items } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav aria-label="Breadcrumb" class="py-3"> <ol class="flex flex-wrap text-sm text-gray-500"> ${items.map((item, index) => renderTemplate`<li class="flex items-center"> ${index > 0 && renderTemplate`<svg class="mx-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"> <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"></path> </svg>`} <a${addAttribute(item.href, "href")}${addAttribute([
    "hover:text-gray-700",
    item.isActive ? "font-medium text-primary-600" : ""
  ], "class:list")}${addAttribute(item.isActive ? "page" : void 0, "aria-current")}> ${item.label} </a> </li>`)} </ol> </nav>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/Breadcrumb.astro", void 0);

export { $$Header as $, $$Breadcrumb as a, $$Footer as b };
