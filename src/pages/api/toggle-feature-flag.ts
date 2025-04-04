/**
 * API Endpoint: Toggle Feature Flag (Placeholder)
 * 
 * This endpoint has been deprecated. Feature flags are now managed through environment variables.
 */
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, redirect }) => {
  return new Response(
    JSON.stringify({
      success: false,
      message: "Feature flags are now managed through environment variables."
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}; 