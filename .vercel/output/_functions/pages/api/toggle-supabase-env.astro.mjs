export { renderers } from '../../renderers.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const currentPreference = cookies.get("use_local_database")?.value || ("true" );
  const newPreference = currentPreference === "true" ? "false" : "true";
  cookies.set("use_local_database", newPreference, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    // 30 days
    httpOnly: false,
    // Allow JavaScript access
    secure: true,
    // Secure in production
    sameSite: "lax"
  });
  const referer = request.headers.get("referer") || "/";
  return redirect(referer);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
