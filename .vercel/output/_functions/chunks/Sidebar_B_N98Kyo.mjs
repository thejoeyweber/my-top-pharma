import { c as createComponent, a as createAstro, m as maybeRenderHead, e as addAttribute, u as unescapeHTML, b as renderTemplate, r as renderComponent, f as renderScript, i as createTransitionScope } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import 'clsx';
import { a as $$ClientRouter } from './Layout_Dw75zG_e.mjs';
/* empty css                             */

const $$Astro$1 = createAstro();
const $$SidebarLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SidebarLink;
  const { href, label, icon, isActive = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute([
    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative",
    isActive ? "bg-primary-50 text-primary-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary-500 before:rounded-l" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  ], "class:list")}${addAttribute(isActive ? "page" : void 0, "aria-current")}> ${icon && renderTemplate`<span${addAttribute(`flex-shrink-0 ${isActive ? "text-primary-600" : "text-gray-500"} transition-colors duration-200`, "class")} aria-hidden="true">${unescapeHTML(icon)}</span>`} <span class="truncate">${label}</span> ${isActive && renderTemplate`<span class="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-500"></span>`} </a>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/atoms/SidebarLink.astro", void 0);

const $$Astro = createAstro();
const $$Sidebar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Sidebar;
  const { currentPath = "/", isOpen = false } = Astro2.props;
  const isActive = (href) => {
    if (href === "/") {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };
  const navigation = [
    {
      label: "Overview",
      links: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M2.25 13.5h8.25V6a2.25 2.25 0 0 1 2.25-2.25h9a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25V15H2.25A2.25 2.25 0 0 1 0 12.75v-1.5a2.25 2.25 0 0 1 2.25-2.25Z" /></svg>'
        },
        {
          href: "/analytics",
          label: "Analytics",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" /></svg>'
        }
      ]
    },
    {
      label: "Directory",
      links: [
        {
          href: "/companies",
          label: "Companies",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clip-rule="evenodd" /></svg>'
        },
        {
          href: "/products",
          label: "Products",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M11.25 3v4.046a3 3 0 0 0-4.277 4.204H1.5v-6A2.25 2.25 0 0 1 3.75 3h7.5ZM12.75 3h7.5A2.25 2.25 0 0 1 22.5 5.25v6h-5.473a3 3 0 0 0-4.277-4.204V3ZM1.5 15.75v-1.5h4.973a3 3 0 0 0 4.277 4.204V21h-7.5a2.25 2.25 0 0 1-2.25-2.25v-3ZM12.75 21v-2.546a3 3 0 0 0 4.277-4.204H22.5v1.5A2.25 2.25 0 0 1 20.25 21h-7.5Z" /></svg>'
        },
        {
          href: "/therapeutic-areas",
          label: "Therapeutic Areas",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0Zm-6.816 4.496a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.154 1.027l-2.158 1.423a.75.75 0 0 1-1.04-.362l-2.732-6.771-4.096 2.86a.75.75 0 0 1-1.014-.717l.343-5.113L6.775 8.97a.75.75 0 0 1 .772-.763ZM22.5 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21.75a.75.75 0 0 1 .75.75Zm-20.25.75a.75.75 0 0 1 0-1.5H4.5a.75.75 0 0 1 0 1.5H2.25ZM6.17 19.864a.75.75 0 0 1-1.06-1.06l1.59-1.591a.75.75 0 0 1 1.061 1.06l-1.591 1.591Zm11.521 0a.75.75 0 0 1 0-1.06l1.591-1.591a.75.75 0 1 1 1.06 1.06l-1.59 1.591a.75.75 0 0 1-1.061 0ZM12 21.75a.75.75 0 0 1-.75-.75v-2.25a.75.75 0 0 1 1.5 0V21a.75.75 0 0 1-.75.75Z" clip-rule="evenodd" /></svg>'
        },
        {
          href: "/websites",
          label: "Websites",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" /></svg>'
        }
      ]
    },
    {
      label: "Insights",
      links: [
        {
          href: "/reports",
          label: "Reports",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clip-rule="evenodd" /></svg>'
        },
        {
          href: "/alerts",
          label: "Alerts",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clip-rule="evenodd" /></svg>'
        },
        {
          href: "/following",
          label: "Following",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" /></svg>'
        }
      ]
    },
    {
      label: "Your Account",
      links: [
        {
          href: "/profile",
          label: "Profile",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" /></svg>'
        },
        {
          href: "/notifications",
          label: "Notifications",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" /><path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clip-rule="evenodd" /></svg>'
        },
        {
          href: "/preferences",
          label: "Preferences",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg>'
        }
      ]
    }
  ];
  return renderTemplate`${renderComponent($$result, "ViewTransitions", $$ClientRouter, {})} ${maybeRenderHead()}<aside class="sidebar"${addAttribute(createTransitionScope($$result, "j5kradcj"), "data-astro-transition-persist")}> <div${addAttribute([
    "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r border-gray-200 bg-white pt-5 pb-4 transition-transform duration-300 ease-in-out md:translate-x-0",
    isOpen ? "translate-x-0" : "-translate-x-full"
  ], "class:list")}> <!-- Logo with blue-purple gradient matching hero section --> <div class="flex items-center px-4 mb-6"> <div class="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md px-3 py-1.5 flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-teal-400"> <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path> </svg> <span class="text-lg font-medium tracking-tight text-white"><span class="text-teal-400">t</span>op pharma</span> </div> </div> <!-- Navigation --> <nav class="flex-1 space-y-4 px-2 py-1 overflow-y-auto"> ${navigation.map((section) => renderTemplate`<div> <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"> ${section.label} </h3> <div class="mt-3 space-y-1"> ${section.links.map((link) => renderTemplate`${renderComponent($$result, "SidebarLink", $$SidebarLink, { "href": link.href, "label": link.label, "icon": link.icon, "isActive": isActive(link.href) })}`)} </div> </div>`)} </nav> <!-- Footer --> <div class="px-3 py-3 mt-auto border-t border-gray-200"> <div class="flex items-center space-x-3"> <div class="flex-shrink-0"> <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
U
</div> </div> <div class="flex-1 min-w-0"> <p class="text-sm font-medium text-gray-900 truncate">User</p> <p class="text-xs text-gray-500 truncate">user@example.com</p> </div> <button class="p-1 text-gray-400 hover:text-gray-600 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clip-rule="evenodd"></path> </svg> </button> </div> </div> </div> <!-- Mobile overlay --> <div id="sidebar-overlay"${addAttribute([
    "fixed inset-0 z-10 bg-gray-900/50 transition-opacity md:hidden",
    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  ], "class:list")} aria-hidden="true"></div> </aside> ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/organisms/Sidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/organisms/Sidebar.astro", "self");

export { $$Sidebar as $ };
