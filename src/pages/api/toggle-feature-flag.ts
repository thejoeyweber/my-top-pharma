/**
 * API Endpoint: Toggle Feature Flag
 * 
 * This endpoint allows toggling a feature flag's value and redirects back to the 
 * page that made the request. It uses server-side cookies to persist feature flag
 * settings between page loads.
 * 
 * @param {Request} request - The incoming request with flag, value, and redirectUrl
 * @returns {Response} - A redirect response or an error
 */
import type { APIRoute } from 'astro';
import { FEATURES, setFeatureFlag } from '../../utils/featureFlags';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    const { flag, value, redirectUrl } = body;
    
    console.log(`API: Toggling feature flag ${flag} to ${value}`);
    
    // Validate that the flag is valid
    if (!flag || !Object.values(FEATURES).includes(flag)) {
      console.error(`Invalid feature flag: ${flag}`);
      return new Response(
        JSON.stringify({ error: 'Invalid feature flag' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert value to boolean
    const boolValue = Boolean(value);
    
    // Set the feature flag in memory (affects server-side rendering)
    setFeatureFlag(flag, boolValue);
    
    // Prepare to set a cookie with a 30-day expiration
    const cookieName = `ff_${flag.toLowerCase()}`;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    const cookieValue = `${cookieName}=${boolValue}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    
    // If there's a redirect URL, use it; otherwise default to feature flags page
    const targetUrl = redirectUrl || '/admin/audit/feature-flags';
    
    // For a cleaner URL, remove any existing feature flag parameters if they exist
    let cleanUrl = new URL(targetUrl, request.url);
    const flagParam = `ff_${flag.toLowerCase()}`;
    if (cleanUrl.searchParams.has(flagParam)) {
      cleanUrl.searchParams.delete(flagParam);
    }
    
    // Add the new flag value as a URL parameter to ensure immediate effect
    cleanUrl.searchParams.set(flagParam, boolValue.toString());
    
    // Create a redirect response with the cookie
    const response = new Response(null, {
      status: 302,
      headers: {
        'Location': cleanUrl.toString(),
        'Set-Cookie': cookieValue
      }
    });
    
    console.log(`API: Redirecting to ${cleanUrl.toString()} with cookie ${cookieValue}`);
    
    return response;
  } catch (error) {
    console.error('Error toggling feature flag:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to toggle feature flag' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 