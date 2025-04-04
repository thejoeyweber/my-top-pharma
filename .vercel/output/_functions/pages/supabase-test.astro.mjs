import { c as createComponent, m as maybeRenderHead, b as renderTemplate, r as renderComponent } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Dw75zG_e.mjs';
import 'clsx';
import { s as supabase } from '../chunks/supabase_C3b6n6m6.mjs';
export { renderers } from '../renderers.mjs';

const $$SupabaseTest$1 = createComponent(async ($$result, $$props, $$slots) => {
  let connectionStatus = "Testing...";
  let errorMessage = "";
  try {
    const startTime = performance.now();
    const { data, error } = await supabase.from("companies").select("id", { count: "exact", head: true });
    const endTime = performance.now();
    if (error) {
      connectionStatus = "Failed";
      errorMessage = error.message;
    } else {
      connectionStatus = "Connected";
    }
  } catch (error) {
    connectionStatus = "Error";
    errorMessage = error instanceof Error ? error.message : String(error);
  }
  return renderTemplate`${maybeRenderHead()}<div class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"> <h2 class="text-lg font-semibold mb-2">Supabase Connection Test</h2> <div class="flex items-center gap-2 mb-2"> <span>Status:</span> ${connectionStatus === "Connected" && renderTemplate`<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
Connected
</span>`} ${connectionStatus === "Failed" && renderTemplate`<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
Failed
</span>`} ${connectionStatus === "Testing..." && renderTemplate`<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
Testing...
</span>`} ${connectionStatus === "Error" && renderTemplate`<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
Error
</span>`} </div> ${errorMessage && renderTemplate`<div class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700"> ${errorMessage} </div>`} <div class="mt-4 text-sm text-gray-600 dark:text-gray-400"> <p>
This component tests the connection to your Supabase instance.
      Make sure you have set up your environment variables correctly:
</p> <ul class="list-disc list-inside mt-2 space-y-1"> <li>PUBLIC_SUPABASE_URL</li> <li>PUBLIC_SUPABASE_ANON_KEY</li> </ul> </div> </div>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/SupabaseTest.astro", void 0);

const $$SupabaseTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Supabase Connection Test" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <h1 class="text-2xl font-bold mb-6">Supabase Connection Test</h1> <div class="max-w-2xl"> ${renderComponent($$result2, "SupabaseTest", $$SupabaseTest$1, {})} <div class="mt-8 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900"> <h2 class="text-lg font-semibold mb-2">Next Steps</h2> <p class="mb-4">
Once your connection is working, you can:
</p> <ol class="list-decimal list-inside space-y-2"> <li>Run the SQL migrations in Supabase</li> <li>Set up data ingestion from FMP</li> <li>Implement the data fetching in your components</li> </ol> </div> </div> </main> ` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/supabase-test.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/supabase-test.astro";
const $$url = "/supabase-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SupabaseTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
