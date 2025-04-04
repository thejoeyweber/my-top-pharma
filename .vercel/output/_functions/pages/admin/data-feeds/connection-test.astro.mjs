import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../../../chunks/Card_yc1BfYIH.mjs';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const $$ConnectionTest = createComponent(async ($$result, $$props, $$slots) => {
  const SUPABASE_URL = "https://ocglnockxnvmqjwzuqfb.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZ2xub2NreG52bXFqd3p1cWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjU5MzIsImV4cCI6MjA1NzgwMTkzMn0.omJljVbLgAkvyqINJJrZgcK8qZyrSUOxiOSXTwWVQiI";
  async function testConnection(url, key) {
    try {
      const supabase = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      const { data: versionData, error: versionError } = await supabase.rpc("pg_version").select("*");
      if (versionError) {
        const { data: testData, error: testError } = await supabase.from("companies").select("id").limit(1);
        if (testError) {
          throw testError;
        }
      }
      const { data: tableData, error: tableError } = await supabase.from("pg_tables").select("tablename").eq("schemaname", "public");
      let tables = [];
      if (tableError || !tableData) {
        const knownTables = ["companies", "products", "therapeutic_areas", "websites"];
        const tablePromises = knownTables.map(
          (table) => supabase.from(table).select("id", { count: "exact", head: true })
        );
        const results = await Promise.all(tablePromises);
        tables = knownTables.filter((_, index) => !results[index].error);
      } else {
        tables = tableData.map((t) => t.tablename);
      }
      const keyTables = ["companies", "products", "therapeutic_areas", "websites"];
      const tableCounts = await Promise.all(
        keyTables.map(
          (table) => supabase.from(table).select("*", { count: "exact", head: true })
        )
      );
      const keyTablesData = keyTables.map((name, index) => ({
        name,
        count: tableCounts[index].count || 0,
        error: tableCounts[index].error?.message
      }));
      let version = "Unknown";
      if (versionData) {
        version = versionData;
      }
      return {
        success: true,
        error: null,
        tables,
        keyTablesData,
        version: { version }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || String(error),
        tables: [],
        keyTablesData: []
      };
    }
  }
  const connectionResult = await testConnection(SUPABASE_URL, SUPABASE_ANON_KEY);
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Connection Test | Admin | Top Pharma" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100"> <header class="bg-white shadow"> <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> <div class="flex items-center"> <a href="/admin/audit" class="mr-2 text-gray-400 hover:text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path> </svg> </a> <h1 class="text-2xl font-bold text-gray-900">Database Connection Test</h1> </div> <p class="mt-2 text-sm text-gray-500">
Test the current Supabase connection configuration
</p> </div> </header> <main class="py-6"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <!-- Connection Information --> <div class="mb-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-lg font-medium mb-4">Connection Configuration</h2> <div class="bg-white p-4 rounded-lg border border-gray-200 mb-4"> <div> <h3 class="text-base font-medium">Supabase Connection</h3> <p class="text-sm text-gray-500 mt-1">
Connection is now managed through environment variables (.env and .env.local):
</p> <pre class="mt-2 text-xs font-mono bg-gray-50 p-2 rounded">PUBLIC_SUPABASE_URL=${SUPABASE_URL}
                  </pre> </div> </div> <div${addAttribute(`p-4 rounded-lg border ${connectionResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`, "class")}> <div class="flex"> <div class="flex-shrink-0"> ${connectionResult.success ? renderTemplate`<svg class="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>` : renderTemplate`<svg class="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path> </svg>`} </div> <div class="ml-3"> <h3${addAttribute(`text-sm font-medium ${connectionResult.success ? "text-green-800" : "text-red-800"}`, "class")}> ${connectionResult.success ? "Connection Successful" : "Connection Failed"} </h3> <div${addAttribute(`mt-2 text-sm ${connectionResult.success ? "text-green-700" : "text-red-700"}`, "class")}> ${connectionResult.success ? renderTemplate`<p>Successfully connected to Supabase at ${SUPABASE_URL}</p>` : renderTemplate`<p>Error: ${connectionResult.error}</p>`} </div> </div> </div> </div> </div> ` })} </div> ${connectionResult.success && renderTemplate`<div class="mb-6"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-lg font-medium mb-4">Database Tables</h2> <div class="overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Name</th> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Count</th> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${connectionResult.keyTablesData.map((table) => renderTemplate`<tr> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${table.name}</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${table.count}</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> ${table.error ? renderTemplate`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
Error
</span>` : renderTemplate`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
OK
</span>`} </td> </tr>`)} </tbody> </table> </div> </div> ` })} </div>`} </div> </main> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/data-feeds/connection-test.astro", void 0);
const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/data-feeds/connection-test.astro";
const $$url = "/admin/data-feeds/connection-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ConnectionTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
