import { c as createComponent, a as createAstro, b as renderTemplate, g as defineScriptVars, r as renderComponent, e as addAttribute, m as maybeRenderHead } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import { $ as $$Button } from './Button_D9GGRmJN.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$FollowButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FollowButton;
  const {
    entityId,
    entityType,
    isFollowing = false,
    size = "md",
    class: className = ""
  } = Astro2.props;
  const buttonId = `follow-button-${entityType}-${entityId}`;
  const storageKey = `pharma_followed_${entityType}_${entityId}`;
  return renderTemplate(_a || (_a = __template(["", "<div", "", "", "> ", " </div> <script>(function(){", `
  // Client-side script for handling follow/unfollow actions with localStorage
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById(buttonId);
    
    if (button) {
      // Initialize state from localStorage on page load
      const storedState = localStorage.getItem(storageKey);
      const isCurrentlyFollowing = storedState === 'true';
      
      // Update initial button appearance based on localStorage
      if (isCurrentlyFollowing) {
        button.classList.add('following');
        button.classList.add('bg-white');
        button.classList.remove('bg-primary-600');
        button.classList.remove('text-white');
        button.classList.add('text-gray-700');
        button.classList.add('border-gray-300');
        
        const textSpan = button.querySelector('.follow-text');
        if (textSpan) {
          textSpan.textContent = 'Following';
        }
        
        const iconSpan = button.querySelector('.follow-icon');
        if (iconSpan) {
          iconSpan.innerHTML = \`
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          \`;
        }
      }
      
      button.addEventListener('click', () => {
        // Toggle following state
        const isCurrentlyFollowing = button.classList.contains('following');
        
        // Store the new state in localStorage
        localStorage.setItem(storageKey, (!isCurrentlyFollowing).toString());
        
        if (isCurrentlyFollowing) {
          // Unfollow
          button.classList.remove('following');
          button.classList.remove('bg-white');
          button.classList.add('bg-primary-600');
          button.classList.add('text-white');
          button.classList.remove('text-gray-700');
          button.classList.remove('border-gray-300');
          
          // Update icon and text
          const iconSpan = button.querySelector('.follow-icon');
          if (iconSpan) {
            iconSpan.innerHTML = \`
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            \`;
          }
          
          const textSpan = button.querySelector('.follow-text');
          if (textSpan) {
            textSpan.textContent = 'Follow';
          }
        } else {
          // Follow
          button.classList.add('following');
          button.classList.add('bg-white');
          button.classList.remove('bg-primary-600');
          button.classList.remove('text-white');
          button.classList.add('text-gray-700');
          button.classList.add('border-gray-300');
          
          // Update icon and text
          const iconSpan = button.querySelector('.follow-icon');
          if (iconSpan) {
            iconSpan.innerHTML = \`
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            \`;
          }
          
          const textSpan = button.querySelector('.follow-text');
          if (textSpan) {
            textSpan.textContent = 'Following';
          }
        }
        
        // Dispatch a custom event that other components can listen for
        const event = new CustomEvent('followStatusChanged', {
          detail: {
            entityId,
            entityType,
            isFollowing: !isCurrentlyFollowing
          },
          bubbles: true
        });
        
        button.dispatchEvent(event);
      });
    }
  });
})();<\/script>`], ["", "<div", "", "", "> ", " </div> <script>(function(){", `
  // Client-side script for handling follow/unfollow actions with localStorage
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById(buttonId);
    
    if (button) {
      // Initialize state from localStorage on page load
      const storedState = localStorage.getItem(storageKey);
      const isCurrentlyFollowing = storedState === 'true';
      
      // Update initial button appearance based on localStorage
      if (isCurrentlyFollowing) {
        button.classList.add('following');
        button.classList.add('bg-white');
        button.classList.remove('bg-primary-600');
        button.classList.remove('text-white');
        button.classList.add('text-gray-700');
        button.classList.add('border-gray-300');
        
        const textSpan = button.querySelector('.follow-text');
        if (textSpan) {
          textSpan.textContent = 'Following';
        }
        
        const iconSpan = button.querySelector('.follow-icon');
        if (iconSpan) {
          iconSpan.innerHTML = \\\`
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          \\\`;
        }
      }
      
      button.addEventListener('click', () => {
        // Toggle following state
        const isCurrentlyFollowing = button.classList.contains('following');
        
        // Store the new state in localStorage
        localStorage.setItem(storageKey, (!isCurrentlyFollowing).toString());
        
        if (isCurrentlyFollowing) {
          // Unfollow
          button.classList.remove('following');
          button.classList.remove('bg-white');
          button.classList.add('bg-primary-600');
          button.classList.add('text-white');
          button.classList.remove('text-gray-700');
          button.classList.remove('border-gray-300');
          
          // Update icon and text
          const iconSpan = button.querySelector('.follow-icon');
          if (iconSpan) {
            iconSpan.innerHTML = \\\`
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            \\\`;
          }
          
          const textSpan = button.querySelector('.follow-text');
          if (textSpan) {
            textSpan.textContent = 'Follow';
          }
        } else {
          // Follow
          button.classList.add('following');
          button.classList.add('bg-white');
          button.classList.remove('bg-primary-600');
          button.classList.remove('text-white');
          button.classList.add('text-gray-700');
          button.classList.add('border-gray-300');
          
          // Update icon and text
          const iconSpan = button.querySelector('.follow-icon');
          if (iconSpan) {
            iconSpan.innerHTML = \\\`
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            \\\`;
          }
          
          const textSpan = button.querySelector('.follow-text');
          if (textSpan) {
            textSpan.textContent = 'Following';
          }
        }
        
        // Dispatch a custom event that other components can listen for
        const event = new CustomEvent('followStatusChanged', {
          detail: {
            entityId,
            entityType,
            isFollowing: !isCurrentlyFollowing
          },
          bubbles: true
        });
        
        button.dispatchEvent(event);
      });
    }
  });
})();<\/script>`])), maybeRenderHead(), addAttribute(["follow-button-container", className], "class:list"), addAttribute(entityId, "data-entity-id"), addAttribute(entityType, "data-entity-type"), renderComponent($$result, "Button", $$Button, { "id": buttonId, "type": "button", "variant": isFollowing ? "outline" : "primary", "size": size, "class:list": [
    "follow-button",
    isFollowing ? "following" : ""
  ] }, { "default": ($$result2) => renderTemplate` <span class="follow-icon inline-block mr-1"> ${isFollowing ? renderTemplate`<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>` : renderTemplate`<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg>`} </span> <span class="follow-text">${isFollowing ? "Following" : "Follow"}</span> ` }), defineScriptVars({ buttonId, entityId, entityType, storageKey }));
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/FollowButton.astro", void 0);

export { $$FollowButton as $ };
