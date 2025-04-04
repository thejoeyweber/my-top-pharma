import { c as createComponent, r as renderComponent, f as renderScript, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Dw75zG_e.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
export { renderers } from '../renderers.mjs';

const $$ForgotPassword = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Reset Password | Top Pharma", "description": "Reset your Top Pharma account password" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"> <div class="sm:mx-auto sm:w-full sm:max-w-md"> <div class="text-center"> <a href="/" class="inline-flex items-center"> <span class="text-3xl font-display font-bold text-pharma-blue">Top<span class="text-pharma-teal">Pharma</span></span> </a> <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
Reset your password
</h2> <p class="mt-2 text-sm text-gray-600">
Or <a href="/login" class="font-medium text-primary-600 hover:text-primary-500">sign in to your account</a> </p> </div> <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md"> ${renderComponent($$result2, "Card", $$Card, { "padding": "lg", "class": "px-4 py-8 shadow-lg sm:rounded-lg sm:px-10" }, { "default": ($$result3) => renderTemplate`  <div id="success-message" class="mb-4 rounded-md bg-green-50 p-4 hidden"> <div class="flex"> <div class="flex-shrink-0"> <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> </div> <div class="ml-3"> <p class="text-sm font-medium text-green-800">
We've sent a password reset link to your email address. Please check your inbox.
</p> </div> </div> </div>  <form id="reset-form" class="space-y-6"> <div> <label for="email" class="block text-sm font-medium text-gray-700">
Email address
</label> <div class="mt-1"> <input id="email" name="email" type="email" autocomplete="email" required class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"> </div> <p class="mt-2 text-sm text-gray-500">
We'll send a link to this email address to reset your password.
</p> </div> <div> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "primary", "fullWidth": true, "id": "submit-button" }, { "default": ($$result4) => renderTemplate`
Send reset link
` })} </div> </form> ` })} </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/forgot-password.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/forgot-password.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/forgot-password.astro";
const $$url = "/forgot-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ForgotPassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
