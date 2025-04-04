import { c as createComponent, a as createAstro, m as maybeRenderHead, e as addAttribute, d as renderSlot, b as renderTemplate } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const {
    padding = "md",
    hover = false,
    class: className = ""
  } = Astro2.props;
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };
  const hoverClasses = hover ? "transition-shadow hover:shadow-card-hover" : "";
  const classes = [
    "bg-white rounded-lg shadow-card",
    paddingClasses[padding],
    hoverClasses,
    className
  ].join(" ");
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(classes, "class")}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/atoms/Card.astro", void 0);

export { $$Card as $ };
