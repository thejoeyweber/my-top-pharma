/**
 * API Endpoint: Reset Feature Flags
 * 
 * This endpoint resets all feature flags to their default values and redirects back
 * to the page that made the request.
 * 
 * @param {Request} request - The incoming request with redirectUrl
 * @returns {Response} - A redirect response or an error
 */
import type { APIRoute } from 'astro';
import { resetFeatureFlags, FEATURES } from '../../utils/featureFlags';

interface ResetFeatureFlagsRequest {
  redirectUrl?: string;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  // Only allow this endpoint in development and staging environments
  if (import.meta.env.PROD) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Feature flag resetting is not allowed in production"
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
  
  try {
    console.log("API: Resetting all feature flags to defaults");
    
    // Parse the JSON body from the request
    const body = await request.json();
    const { redirectUrl } = body;
    
    // Reset all feature flags to their default values
    resetFeatureFlags();
    
    // Create cookie-clearing headers for each feature flag
    const cookieHeaders = Object.values(FEATURES).map(flag => {
      const expires = new Date(0); // Set to epoch to expire immediately
      return `ff_${flag.toLowerCase()}=false; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    });
    
    // If there's a redirect URL, use it; otherwise default to feature flags page
    const targetUrl = redirectUrl || '/admin/audit/feature-flags';
    
    // For a cleaner URL, remove any existing feature flag parameters
    let cleanUrl = new URL(targetUrl, request.url);
    
    // Clear all feature flag URL parameters
    Object.values(FEATURES).forEach(flag => {
      const paramName = `ff_${flag.toLowerCase()}`;
      if (cleanUrl.searchParams.has(paramName)) {
        cleanUrl.searchParams.delete(paramName);
      }
    });
    
    // Create a redirect response with the cookie-clearing headers
    const response = new Response(null, {
      status: 302,
      headers: {
        "Location": cleanUrl.toString()
      }
    });
    
    // Add all cookie-clearing headers
    cookieHeaders.forEach(cookie => {
      response.headers.append("Set-Cookie", cookie);
    });
    
    console.log(`API: Redirecting to ${cleanUrl.toString()} with ${cookieHeaders.length} cleared cookies`);
    
    return response;
  } catch (error) {
    console.error('Error resetting feature flags:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to reset feature flags' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 