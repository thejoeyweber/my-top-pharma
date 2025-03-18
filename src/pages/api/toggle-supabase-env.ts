import type { APIRoute } from 'astro';

/**
 * API endpoint to toggle between local and remote Supabase instances
 * 
 * This sets a cookie that will be read by the supabase client to determine
 * which environment to use. It doesn't modify the .env files, just user preference.
 */
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Get current preference from cookie or fallback to env var
  const currentPreference = cookies.get('use_local_database')?.value || 
    (import.meta.env.PUBLIC_USE_LOCAL_DATABASE === 'true' ? 'true' : 'false');
  
  // Toggle preference
  const newPreference = currentPreference === 'true' ? 'false' : 'true';
  
  // Set the cookie with a 30-day expiration
  cookies.set('use_local_database', newPreference, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: false, // Allow JavaScript access
    secure: import.meta.env.PROD, // Secure in production
    sameSite: 'lax'
  });
  
  // Redirect back to the referring page or home page
  const referer = request.headers.get('referer') || '/';
  return redirect(referer);
}; 