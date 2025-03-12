import type { APIRoute } from 'astro';
import { FEATURES, setFeatureFlag } from '../../utils/featureFlags';

interface ToggleFeatureFlagRequest {
  flag: string;
  value: boolean;
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
    const { flag, value } = requestData;
    
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
    
    // Set the feature flag
    setFeatureFlag(flag as keyof typeof FEATURES, value);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Feature flag ${flag} set to ${value}`
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
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