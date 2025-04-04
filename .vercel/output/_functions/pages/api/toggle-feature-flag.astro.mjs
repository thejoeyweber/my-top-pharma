export { renderers } from '../../renderers.mjs';

const POST = async ({ request, redirect }) => {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
