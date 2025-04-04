import { c as createComponent, r as renderComponent, f as renderScript, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Dw75zG_e.mjs';
import { $ as $$Card } from '../chunks/Card_yc1BfYIH.mjs';
import { $ as $$Button } from '../chunks/Button_D9GGRmJN.mjs';
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sign In | Top Pharma", "description": "Sign in to your Top Pharma account" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"> <div class="sm:mx-auto sm:w-full sm:max-w-md"> <div class="text-center"> <a href="/" class="inline-flex items-center"> <span class="text-3xl font-display font-bold text-pharma-blue">Top<span class="text-pharma-teal">Pharma</span></span> </a> <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
Sign in to your account
</h2> <p class="mt-2 text-sm text-gray-600">
Or <a href="/register" class="font-medium text-primary-600 hover:text-primary-500">create a new account</a> </p> </div> <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md"> ${renderComponent($$result2, "Card", $$Card, { "padding": "lg", "class": "px-4 py-8 shadow-lg sm:rounded-lg sm:px-10" }, { "default": ($$result3) => renderTemplate` <form class="space-y-6" action="/dashboard" method="GET"> <div> <label for="email" class="block text-sm font-medium text-gray-700">
Email address
</label> <div class="mt-1"> <input id="email" name="email" type="email" autocomplete="email" required class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"> </div> </div> <div> <label for="password" class="block text-sm font-medium text-gray-700">
Password
</label> <div class="mt-1"> <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"> </div> </div> <div class="flex items-center justify-between"> <div class="flex items-center"> <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"> <label for="remember-me" class="ml-2 block text-sm text-gray-900">
Remember me
</label> </div> <div class="text-sm"> <a href="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
Forgot your password?
</a> </div> </div> <div> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "primary", "fullWidth": true }, { "default": ($$result4) => renderTemplate`
Sign in
` })} </div> </form> <div class="mt-6"> <div class="relative"> <div class="absolute inset-0 flex items-center"> <div class="w-full border-t border-gray-300"></div> </div> <div class="relative flex justify-center text-sm"> <span class="bg-white px-2 text-gray-500">Or continue with</span> </div> </div> <div class="mt-6 grid grid-cols-2 gap-3"> <div> ${renderComponent($$result3, "Button", $$Button, { "type": "button", "variant": "outline", "fullWidth": true, "class": "inline-flex justify-center" }, { "default": ($$result4) => renderTemplate` <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path> </svg> <span>GitHub</span> ` })} </div> <div> ${renderComponent($$result3, "Button", $$Button, { "type": "button", "variant": "outline", "fullWidth": true, "class": "inline-flex justify-center" }, { "default": ($$result4) => renderTemplate` <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path> <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path> <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path> <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path> </svg> <span>Google</span> ` })} </div> </div> </div> ` })} </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/login.astro", void 0);

const $$file = "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
