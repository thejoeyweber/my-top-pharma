import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, d as renderSlot, m as maybeRenderHead, u as unescapeHTML } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';

const $$Astro = createAstro();
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    fullWidth = false,
    href,
    class: className = "",
    ariaLabel,
    loading = false,
    iconLeft,
    iconRight,
    ...rest
    // Capture all other props
  } = Astro2.props;
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500";
  const sizeClasses = {
    xs: "text-xs px-2 py-1 rounded",
    sm: "text-sm px-3 py-1.5 rounded",
    md: "text-base px-4 py-2 rounded-md",
    lg: "text-lg px-6 py-3 rounded-lg"
  };
  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-400",
    outline: "bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:text-primary-300 disabled:border-primary-300",
    text: "bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:text-primary-300",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300",
    success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-green-300"
  };
  const widthClasses = fullWidth ? "w-full" : "";
  const loadingClasses = loading ? "relative !text-transparent" : "";
  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    widthClasses,
    loadingClasses,
    className
  ].join(" ");
  const Element = href && !disabled ? "a" : "button";
  const attrs = {
    class: classes,
    ...Element === "button" ? {
      type,
      disabled: disabled || loading
    } : {
      href,
      role: "button",
      tabindex: "0"
    },
    "aria-label": ariaLabel,
    "aria-disabled": disabled ? "true" : void 0,
    ...rest
  };
  return renderTemplate`${renderComponent($$result, "Element", Element, { ...attrs }, { "default": ($$result2) => renderTemplate`${loading && renderTemplate`${maybeRenderHead()}<div class="absolute inset-0 flex items-center justify-center"> <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </div>`}${iconLeft && !loading && renderTemplate`<span class="mr-2">${unescapeHTML(iconLeft)}</span>`}${renderSlot($$result2, $$slots["default"])} ${iconRight && !loading && renderTemplate`<span class="ml-2">${unescapeHTML(iconRight)}</span>`}` })}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/atoms/Button.astro", void 0);

export { $$Button as $ };
