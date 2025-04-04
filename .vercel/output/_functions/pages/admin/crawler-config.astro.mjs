import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../../chunks/Card_yc1BfYIH.mjs';
export { renderers } from '../../renderers.mjs';

const $$CrawlerConfig = createComponent(($$result, $$props, $$slots) => {
  const crawlerConfig = {
    general: {
      enableCrawling: true,
      maxConcurrentRequests: 10,
      requestTimeout: 3e4,
      respectRobotsTxt: true,
      userAgent: "TopPharma Crawler/1.0"
    },
    scheduling: {
      frequency: "daily",
      startTime: "03:00",
      daysToRun: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString(),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString()
    },
    domainRules: [
      {
        id: "rule1",
        pattern: "*.pfizer.com/*",
        enabled: true,
        maxDepth: 3,
        priority: "high"
      },
      {
        id: "rule2",
        pattern: "*.jnj.com/*",
        enabled: true,
        maxDepth: 2,
        priority: "medium"
      },
      {
        id: "rule3",
        pattern: "*.novartis.com/*",
        enabled: true,
        maxDepth: 3,
        priority: "high"
      },
      {
        id: "rule4",
        pattern: "*.gsk.com/*",
        enabled: false,
        maxDepth: 2,
        priority: "low"
      }
    ]
  };
  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Crawler Configuration | Admin | Top Pharma" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100"> <header class="bg-white shadow"> <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> <div class="flex items-center"> <a href="/admin" class="mr-2 text-gray-400 hover:text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path> </svg> </a> <h1 class="text-3xl font-bold tracking-tight text-gray-900">Crawler Configuration</h1> </div> </div> </header> <main class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8"> <!-- General Settings --> <div class="mb-6"> <h2 class="text-lg font-semibold text-gray-900 mb-3">General Settings</h2> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="px-4 py-5 sm:p-6"> <div class="grid grid-cols-1 gap-6 sm:grid-cols-2"> <div> <label for="enable-crawling" class="block text-sm font-medium text-gray-700">Enable Crawling</label> <div class="mt-2"> <select id="enable-crawling" name="enable-crawling" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"> <option value="true"${addAttribute(crawlerConfig.general.enableCrawling, "selected")}>Enabled</option> <option value="false"${addAttribute(false, "selected")}>Disabled</option> </select> </div> </div> <div> <label for="max-concurrent" class="block text-sm font-medium text-gray-700">Max Concurrent Requests</label> <div class="mt-2"> <input type="number" name="max-concurrent" id="max-concurrent"${addAttribute(crawlerConfig.general.maxConcurrentRequests, "value")} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"> </div> </div> <div> <label for="request-timeout" class="block text-sm font-medium text-gray-700">Request Timeout (ms)</label> <div class="mt-2"> <input type="number" name="request-timeout" id="request-timeout"${addAttribute(crawlerConfig.general.requestTimeout, "value")} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"> </div> </div> <div> <label for="respect-robots" class="block text-sm font-medium text-gray-700">Respect robots.txt</label> <div class="mt-2"> <select id="respect-robots" name="respect-robots" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"> <option value="true"${addAttribute(crawlerConfig.general.respectRobotsTxt, "selected")}>Yes</option> <option value="false"${addAttribute(false, "selected")}>No</option> </select> </div> </div> <div> <label for="user-agent" class="block text-sm font-medium text-gray-700">User Agent</label> <div class="mt-2"> <input type="text" name="user-agent" id="user-agent"${addAttribute(crawlerConfig.general.userAgent, "value")} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"> </div> </div> </div> <div class="mt-6 flex justify-end"> <button type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
Reset
</button> <button type="button" class="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
Save Changes
</button> </div> </div> ` })} </div> <!-- Scheduling Settings --> <div class="mb-6"> <h2 class="text-lg font-semibold text-gray-900 mb-3">Scheduling</h2> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="px-4 py-5 sm:p-6"> <div class="grid grid-cols-1 gap-6 sm:grid-cols-2"> <div> <label for="frequency" class="block text-sm font-medium text-gray-700">Crawl Frequency</label> <div class="mt-2"> <select id="frequency" name="frequency" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"> <option value="hourly">Hourly</option> <option value="daily"${addAttribute(crawlerConfig.scheduling.frequency === "daily", "selected")}>Daily</option> <option value="weekly"${addAttribute(crawlerConfig.scheduling.frequency === "weekly", "selected")}>Weekly</option> <option value="monthly"${addAttribute(crawlerConfig.scheduling.frequency === "monthly", "selected")}>Monthly</option> </select> </div> </div> <div> <label for="start-time" class="block text-sm font-medium text-gray-700">Start Time (UTC)</label> <div class="mt-2"> <input type="time" name="start-time" id="start-time"${addAttribute(crawlerConfig.scheduling.startTime, "value")} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"> </div> </div> <div class="sm:col-span-2"> <label class="block text-sm font-medium text-gray-700">Days to Run</label> <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-7"> ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => renderTemplate`<div class="flex items-center"> <input${addAttribute(`day-${day.toLowerCase()}`, "id")}${addAttribute(`day-${day.toLowerCase()}`, "name")} type="checkbox"${addAttribute(crawlerConfig.scheduling.daysToRun.includes(day), "checked")} class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"> <label${addAttribute(`day-${day.toLowerCase()}`, "for")} class="ml-2 text-sm text-gray-700">${day}</label> </div>`)} </div> </div> <div> <label class="block text-sm font-medium text-gray-700">Last Run</label> <div class="mt-2 text-sm text-gray-900">${formatDate(crawlerConfig.scheduling.lastRun)}</div> </div> <div> <label class="block text-sm font-medium text-gray-700">Next Scheduled Run</label> <div class="mt-2 text-sm text-gray-900">${formatDate(crawlerConfig.scheduling.nextRun)}</div> </div> </div> <div class="mt-6 flex justify-end"> <button type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
Reset Schedule
</button> <button type="button" class="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
Save Schedule
</button> <button type="button" class="ml-3 inline-flex items-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
Run Crawler Now
</button> </div> </div> ` })} </div> <!-- Domain Rules --> <div class="mb-6"> <h2 class="text-lg font-semibold text-gray-900 mb-3">Domain Rules</h2> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="px-4 py-5 sm:p-6"> <div class="mb-4 flex justify-end"> <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
Add New Rule
</button> </div> <div class="overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200"> <thead> <tr> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Depth</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${crawlerConfig.domainRules.map((rule) => renderTemplate`<tr> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rule.pattern}</td> <td class="px-6 py-4 whitespace-nowrap text-sm"> <span${addAttribute(`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${rule.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, "class")}> ${rule.enabled ? "Enabled" : "Disabled"} </span> </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.maxDepth}</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> <button type="button" class="text-primary-600 hover:text-primary-900 mr-3">Edit</button> <button type="button" class="text-red-600 hover:text-red-900">Delete</button> </td> </tr>`)} </tbody> </table> </div> </div> ` })} </div> <!-- Data Extraction Rules --> <div class="mb-6"> <h2 class="text-lg font-semibold text-gray-900 mb-3">Data Extraction Rules</h2> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="px-4 py-5 sm:p-6"> <div class="mb-4 flex justify-end"> <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
Add New Extraction Rule
</button> </div> <div class="overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200"> <thead> <tr> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Name</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CSS Selector</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${crawlerConfig.dataExtractionRules.map((rule) => renderTemplate`<tr> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rule.name}</td> <td class="px-6 py-4 text-sm text-gray-500">${rule.selector}</td> <td class="px-6 py-4 whitespace-nowrap text-sm"> <span${addAttribute(`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${rule.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, "class")}> ${rule.enabled ? "Enabled" : "Disabled"} </span> </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> <button type="button" class="text-primary-600 hover:text-primary-900 mr-3">Edit</button> <button type="button" class="text-red-600 hover:text-red-900">Delete</button> </td> </tr>`)} </tbody> </table> </div> </div> ` })} </div> </main> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/crawler-config.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/crawler-config.astro";
const $$url = "/admin/crawler-config";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CrawlerConfig,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
