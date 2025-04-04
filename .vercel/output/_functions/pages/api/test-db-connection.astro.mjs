import { createClient } from '@supabase/supabase-js';
import { a as supabaseAdmin } from '../../chunks/supabase_C3b6n6m6.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  try {
    console.log("Testing Supabase connection...");
    const supabaseUrl = "https://ocglnockxnvmqjwzuqfb.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZ2xub2NreG52bXFqd3p1cWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjU5MzIsImV4cCI6MjA1NzgwMTkzMn0.omJljVbLgAkvyqINJJrZgcK8qZyrSUOxiOSXTwWVQiI";
    const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZ2xub2NreG52bXFqd3p1cWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjIyNTkzMiwiZXhwIjoyMDU3ODAxOTMyfQ.2edZhmCJPW2DKISyfFLfoqfvanWo4Tlh4VruxqxU1As";
    const credentialStatus = {
      url: {
        provided: !!supabaseUrl,
        sample: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : null
      },
      key: {
        provided: !!supabaseKey,
        length: supabaseKey?.length || 0
      },
      serviceRole: {
        provided: !!serviceRoleKey,
        length: serviceRoleKey?.length || 0
      }
    };
    console.log("Credential status:", credentialStatus);
    if (!supabaseUrl || !supabaseKey) ;
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Testing companies table with regular client...");
    const { data: companiesData, error: companiesError } = await supabase.from("companies").select("count");
    let companiesStatus = {
      success: !companiesError,
      error: companiesError ? {
        message: companiesError.message,
        code: companiesError.code,
        details: companiesError.details,
        hint: companiesError.hint
      } : null,
      count: companiesData?.[0]?.count || 0
    };
    if (companiesError) {
      console.error("Companies table test failed with regular client:", companiesError);
    } else {
      console.log("Companies table test successful with regular client:", companiesData);
    }
    console.log("Testing database system schema...");
    const { data: tablesData, error: tablesError } = await supabase.from("pg_tables").select("schemaname, tablename").eq("schemaname", "public").limit(10);
    let schemaStatus = {
      success: !tablesError,
      error: tablesError ? {
        message: tablesError.message,
        code: tablesError.code,
        details: tablesError.details,
        hint: tablesError.hint || "This is expected to fail with anonymous key due to RLS restrictions"
      } : null,
      tables: tablesData || []
    };
    let adminStatus = {
      success: false,
      tested: false,
      error: null
    };
    if (serviceRoleKey) {
      console.log("Testing companies table with admin client...");
      try {
        if (!supabaseAdmin) {
          throw new Error("Supabase admin client not initialized");
        }
        const { data: adminData, error: adminError } = await supabaseAdmin.from("companies").select("count");
        adminStatus = {
          success: !adminError,
          tested: true,
          error: adminError ? {
            message: adminError.message,
            code: adminError.code,
            details: adminError.details,
            hint: adminError.hint
          } : null,
          count: adminData?.[0]?.count || 0
        };
        if (adminError) {
          console.error("Companies table test failed with admin client:", adminError);
        } else {
          console.log("Companies table test successful with admin client:", adminData);
        }
      } catch (adminErr) {
        console.error("Admin client test failed with exception:", adminErr);
        adminStatus.error = {
          message: adminErr instanceof Error ? adminErr.message : String(adminErr),
          stack: adminErr instanceof Error ? adminErr.stack : void 0
        };
      }
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const overallSuccess = !companiesError || adminStatus.tested && adminStatus.success;
    return new Response(
      JSON.stringify({
        success: overallSuccess,
        timestamp,
        credentials: credentialStatus,
        companies: companiesStatus,
        schema: schemaStatus,
        admin: adminStatus,
        message: overallSuccess ? "Database connection successful" : "Database connection failed with both regular and admin clients"
      }),
      {
        status: overallSuccess ? 200 : 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Database connection test failed with exception:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : void 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        message: "Database connection test failed with an exception"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
