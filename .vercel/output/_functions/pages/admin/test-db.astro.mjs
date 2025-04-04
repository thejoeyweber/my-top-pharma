import { c as createComponent, r as renderComponent, f as renderScript, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_DgtcCfCn.mjs';
import { $ as $$Card } from '../../chunks/Card_yc1BfYIH.mjs';
export { renderers } from '../../renderers.mjs';

const $$TestDb = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Database Connection Test | Admin | Top Pharma" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100"> <header class="bg-white shadow"> <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> <div class="flex items-center"> <a href="/admin" class="mr-2 text-gray-400 hover:text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path> </svg> </a> <h1 class="text-3xl font-bold tracking-tight text-gray-900">Database Connection Test</h1> </div> </div> </header> <main class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8"> <!-- Test Connection Section --> <div class="mb-8"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <div class="flex items-center justify-between"> <div> <h3 class="text-lg font-medium">Supabase Connection Test</h3> <p class="text-sm text-gray-500 mt-1">
Test the connection to your Supabase database and check for schema issues
</p> </div> <div> <button id="test-connection" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
Test Connection
</button> </div> </div> <!-- Test Results (hidden initially) --> <div id="test-results" class="mt-4 hidden"> <div class="rounded-md bg-gray-50 p-4"> <div class="flex"> <div class="flex-shrink-0"> <svg id="test-loading-icon" class="h-5 w-5 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> <svg id="test-success-icon" class="h-5 w-5 text-green-400 hidden" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <svg id="test-error-icon" class="h-5 w-5 text-red-400 hidden" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path> </svg> </div> <div class="ml-3 flex-1"> <h3 id="test-title" class="text-sm font-medium text-gray-800">Testing connection...</h3> <div id="test-message" class="mt-2 text-sm text-gray-600"></div> <!-- Detailed Results --> <div id="detailed-results" class="mt-4 hidden"> <h4 class="text-sm font-medium text-gray-800 mb-2">Detailed Results:</h4> <!-- Credentials Section --> <div class="mb-3"> <h5 class="text-xs font-medium text-gray-700">Credentials</h5> <div id="credentials-results" class="ml-2 mt-1 text-xs"></div> </div> <!-- Companies Table Section --> <div class="mb-3"> <h5 class="text-xs font-medium text-gray-700">Companies Table (Regular Client)</h5> <div id="companies-results" class="ml-2 mt-1 text-xs"></div> </div> <!-- Admin Client Section --> <div class="mb-3"> <h5 class="text-xs font-medium text-gray-700">Admin Client (Service Role)</h5> <div id="admin-results" class="ml-2 mt-1 text-xs"></div> </div> <!-- Schema Section --> <div> <h5 class="text-xs font-medium text-gray-700">Database Schema</h5> <div id="schema-results" class="ml-2 mt-1 text-xs"></div> </div> <!-- Raw Response --> <div class="mt-4"> <details> <summary class="text-xs font-medium text-gray-700 cursor-pointer">Raw Response</summary> <pre id="raw-results" class="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded-md max-h-60"></pre> </details> </div> </div> </div> </div> </div> </div> </div> ` })} </div> <!-- Environment Variables Section --> <div class="mb-8"> <h2 class="text-lg font-semibold mb-4">Environment Variables Check</h2> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <p class="text-sm text-gray-500 mb-4">
This section checks if your essential environment variables are configured correctly.
              No actual values are displayed for security reasons.
</p> <table class="min-w-full divide-y divide-gray-200"> <thead> <tr> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200" id="env-var-table"> <tr> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Loading...</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Please wait</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Checking environment variables</td> </tr> </tbody> </table> </div> ` })} </div> <!-- Troubleshooting Guide --> <div class="mb-8"> <h2 class="text-lg font-semibold mb-4">Troubleshooting Guide</h2> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="p-6"> <div class="space-y-4"> <div> <h3 class="font-medium text-gray-900">Missing Credentials</h3> <p class="mt-1 text-sm text-gray-500">
If credentials are missing, make sure your .env.local file contains:
</p> <ul class="mt-2 list-disc pl-5 text-sm text-gray-500"> <li>PUBLIC_SUPABASE_URL - Your Supabase project URL</li> <li>PUBLIC_SUPABASE_ANON_KEY - Your Supabase project's anon/public key</li> <li>SUPABASE_SERVICE_ROLE_KEY - Your Supabase project's service role key (for admin operations)</li> </ul> </div> <div> <h3 class="font-medium text-gray-900">Table Not Found</h3> <p class="mt-1 text-sm text-gray-500">
If the companies table is not found, you need to create it in your Supabase project:
</p> <pre class="mt-2 text-xs bg-gray-100 p-3 rounded-md">CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  headquarters TEXT,
  employee_count INTEGER,
  revenue_usd NUMERIC,
  public_company BOOLEAN DEFAULT false,
  stock_symbol TEXT,
  stock_exchange TEXT,
  founded_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
                </pre> </div> <div> <h3 class="font-medium text-gray-900">Row Level Security (RLS)</h3> <p class="mt-1 text-sm text-gray-500">
We're using two different approaches to handle permissions:
</p> <ul class="mt-2 list-disc pl-5 text-sm text-gray-500"> <li><strong>Regular access:</strong> Use RLS policies to control what operations are allowed with the anonymous key</li> <li><strong>Admin operations:</strong> Use the service role key to bypass RLS for administrative tasks (like importing data)</li> </ul> <p class="mt-2 text-sm text-gray-500">
If admin operations (like data imports) are failing, check that your SUPABASE_SERVICE_ROLE_KEY is correctly configured in .env.local
</p> </div> </div> </div> ` })} </div> </main> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/test-db.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/test-db.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/test-db.astro";
const $$url = "/admin/test-db";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestDb,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
