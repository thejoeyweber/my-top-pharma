import type { APIRoute } from 'astro';
import { resetFeatureFlags, FEATURES } from '../../utils/featureFlags';

interface ResetFeatureFlagsRequest {
  redirectUrl?: string;
}

export const POST: APIRoute = async ({ request }) => {
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
    // Parse request body if present
    let redirectUrl: string | undefined;
    try {
      const requestData = await request.json() as ResetFeatureFlagsRequest;
      redirectUrl = requestData.redirectUrl;
    } catch (e) {
      // Ignore parsing errors - body is optional
    }

    // Reset all feature flags to default values
    resetFeatureFlags();
    
    // Create cookie-clearing headers for each feature flag
    const cookieHeaders = Object.values(FEATURES).map(flag => 
      `ff_${flag.toLowerCase()}=; path=/; max-age=0; SameSite=Lax`
    );
    
    // If a redirect URL is provided, use that with reset parameters
    if (redirectUrl) {
      // Parse the URL to handle existing parameters correctly
      const redirectUrlObj = new URL(redirectUrl, request.url);
      
      // Add reset parameters for each flag to ensure immediate effect
      Object.values(FEATURES).forEach(flag => {
        redirectUrlObj.searchParams.set(`ff_${flag.toLowerCase()}`, 'false');
      });
      
      // Return a redirect response with the cookies
      const response = new Response(null, {
        status: 302,
        headers: {
          "Location": redirectUrlObj.toString()
        }
      });
      
      // Add all cookie headers
      cookieHeaders.forEach(cookie => {
        response.headers.append("Set-Cookie", cookie);
      });
      
      return response;
    }
    
    // Otherwise return a regular JSON response
    const response = new Response(
      JSON.stringify({
        success: true,
        message: "All feature flags reset to default values"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    
    // Add Set-Cookie headers for each feature flag
    cookieHeaders.forEach(cookie => {
      response.headers.append("Set-Cookie", cookie);
    });
    
    return response;
  } catch (error) {
    console.error("Error resetting feature flags:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to reset feature flags"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
} 