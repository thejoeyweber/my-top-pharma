import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_Bl5WGr-R.mjs';
import { s as supabase } from '../../../chunks/supabase_C3b6n6m6.mjs';
export { renderers } from '../../../renderers.mjs';

const $$ConnectionTest = createComponent(async ($$result, $$props, $$slots) => {
  let connectionStatus = "Testing...";
  let errorMessage = "";
  let queryPerformance = null;
  let databaseInfo = null;
  try {
    const startTime = performance.now();
    const { data, error } = await supabase.from("companies").select("id, name").limit(5);
    const endTime = performance.now();
    queryPerformance = (endTime - startTime).toFixed(2);
    if (error) {
      connectionStatus = "Failed";
      errorMessage = error.message;
    } else {
      connectionStatus = "Connected";
      const { data: versionData } = await supabase.rpc("get_db_version");
      databaseInfo = versionData || { version: "Unknown" };
    }
  } catch (error) {
    connectionStatus = "Error";
    errorMessage = error instanceof Error ? error.message : String(error);
  }
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin" },
    { label: "Supabase Connection", href: "/admin/data-sources/connection-test", isActive: true }
  ];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Supabase Connection Test", "breadcrumbs": breadcrumbs }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto"> <div class="mb-8"> <h1 class="text-2xl font-bold mb-2">Supabase Connection Test</h1> <p class="text-gray-600">Test the connection to your Supabase database.</p> </div> <div class="bg-white rounded-lg shadow-sm p-6 mb-6"> <h2 class="text-lg font-semibold mb-4">Connection Status</h2> <div class="flex items-center mb-4"> <div class="mr-3">Status:</div> ${connectionStatus === "Connected" && renderTemplate`<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
Connected
</span>`} ${connectionStatus === "Failed" && renderTemplate`<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
Failed
</span>`} ${connectionStatus === "Testing..." && renderTemplate`<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
Testing...
</span>`} ${connectionStatus === "Error" && renderTemplate`<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
Error
</span>`} </div> ${connectionStatus === "Connected" && renderTemplate`<div> <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"> <div> <dt class="text-sm font-medium text-gray-500">Connection</dt> <dd class="mt-1 text-sm text-gray-900">Supabase</dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Query Performance</dt> <dd class="mt-1 text-sm text-gray-900">${queryPerformance} ms</dd> </div> ${databaseInfo && renderTemplate`<div> <dt class="text-sm font-medium text-gray-500">Database Version</dt> <dd class="mt-1 text-sm text-gray-900">${databaseInfo.version}</dd> </div>`} </dl> </div>`} ${errorMessage && renderTemplate`<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"> <h3 class="text-sm font-medium text-red-800">Error Details</h3> <pre class="mt-1 text-xs text-red-700 overflow-x-auto">${errorMessage}</pre> </div>`} </div> <div class="bg-white rounded-lg shadow-sm p-6 mb-6"> <h2 class="text-lg font-semibold mb-4">Environment Information</h2> <dl class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <dt class="text-sm font-medium text-gray-500">Environment</dt> <dd class="mt-1 text-sm text-gray-900"> ${"Production"} </dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Using Local Database</dt> <dd class="mt-1 text-sm text-gray-900"> ${"Yes" } </dd> </div> <div> <dt class="text-sm font-medium text-gray-500">Supabase URL</dt> <dd class="mt-1 text-xs text-gray-500 truncate"> ${"http://localhost:54321" } </dd> </div> </dl> </div> </div> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/data-sources/connection-test.astro", void 0);
const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/admin/data-sources/connection-test.astro";
const $$url = "/admin/data-sources/connection-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ConnectionTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
