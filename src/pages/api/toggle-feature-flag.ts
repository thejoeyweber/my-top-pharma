import type { APIRoute } from 'astro';
import { FEATURES, setFeatureFlag } from '../../utils/featureFlags';

interface ToggleFeatureFlagRequest {
  flag: string;
  value: boolean;
  redirectUrl?: string;
}

export const POST: APIRoute = async ({ request }) => {
  // Only allow this endpoint in development and staging environments
  if (import.meta.env.PROD) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Feature flag toggling is not allowed in production"
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
    const requestData = await request.json() as ToggleFeatureFlagRequest;
    const { flag, value, redirectUrl } = requestData;
    
    // Validate the feature flag exists
    if (!Object.values(FEATURES).includes(flag as any)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Invalid feature flag: ${flag}`
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Set the feature flag in memory (affects future server renders)
    setFeatureFlag(flag as keyof typeof FEATURES, value);
    
    // Create cookie for the feature flag (visible to both client and server)
    const cookieValue = `ff_${flag.toLowerCase()}=${value}; path=/; max-age=86400; SameSite=Lax`;
    
    // Create a response
    let responseBody = {
      success: true,
      message: `Feature flag ${flag} set to ${value}`
    };
    
    // If a redirect URL is provided, use that with the flag as a URL parameter
    if (redirectUrl) {
      // Parse the URL to handle existing parameters correctly
      const redirectUrlObj = new URL(redirectUrl, request.url);
      
      // Add the feature flag as a URL parameter to ensure immediate effect
      redirectUrlObj.searchParams.set(`ff_${flag.toLowerCase()}`, value.toString());
      
      // Return a redirect response with the cookie
      return new Response(null, {
        status: 302,
        headers: {
          "Location": redirectUrlObj.toString(),
          "Set-Cookie": cookieValue
        }
      });
    }
    
    // Otherwise just return JSON response with the cookie
    const response = new Response(
      JSON.stringify(responseBody),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    
    // Add Set-Cookie header
    response.headers.set("Set-Cookie", cookieValue);
    
    return response;
  } catch (error) {
    console.error("Error toggling feature flag:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid request format"
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
} 