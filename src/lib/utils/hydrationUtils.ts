/**
 * Hydration Utilities
 * 
 * Standard hydration directives for consistent partial hydration across components.
 * This helps enforce best practices and consistent patterns for client:* directives.
 * 
 * @see https://docs.astro.build/en/reference/directives-reference/#client-directives
 */

export const hydrationDirectives = {
  /**
   * Component is hydrated when the page loads
   * Use for critical above-the-fold UI elements that need immediate interactivity.
   */
  IMMEDIATE: 'client:load',
  
  /**
   * Component is hydrated once the page is done with its initial load and the
   * requestIdleCallback event has fired.
   * Best for non-critical UI elements that can wait for the main thread to be idle.
   */
  IDLE: 'client:idle',
  
  /**
   * Component is hydrated once it's visible in the viewport
   * Ideal for below-the-fold components to reduce initial load time.
   */
  VISIBLE: 'client:visible',
  
  /**
   * Component is hydrated only when a specific media query is matched
   * Example usage: client:media="(max-width: 768px)"
   */
  MEDIA: 'client:media',
  
  /**
   * Component is hydrated only on the client, never during SSR
   * Use for components that rely on browser-only APIs or should never render during SSR.
   */
  ONLY: 'client:only'
};

/**
 * Recommended hydration patterns for specific component categories
 */
export const recommendedHydration = {
  // Interactive UI components
  button: hydrationDirectives.IDLE,
  form: hydrationDirectives.VISIBLE,
  modal: hydrationDirectives.IDLE,
  dropdown: hydrationDirectives.VISIBLE,
  accordion: hydrationDirectives.VISIBLE,
  tabs: hydrationDirectives.VISIBLE,
  
  // Heavy/complex components
  datePicker: hydrationDirectives.VISIBLE,
  richTextEditor: hydrationDirectives.VISIBLE,
  chart: hydrationDirectives.VISIBLE,
  map: hydrationDirectives.VISIBLE,
  
  // Critical interactive elements
  mainNav: hydrationDirectives.IMMEDIATE,
  authForms: hydrationDirectives.IMMEDIATE,
  searchBar: hydrationDirectives.IDLE,
  
  // Media components
  videoPlayer: hydrationDirectives.VISIBLE,
  audioPlayer: hydrationDirectives.VISIBLE,
  
  // General purpose
  default: hydrationDirectives.IDLE
};

/**
 * Determine the most appropriate hydration directive for a component
 * 
 * @param componentType - The type of component being hydrated
 * @returns The recommended client directive
 */
export function getHydrationDirective(componentType: keyof typeof recommendedHydration): string {
  return recommendedHydration[componentType] || recommendedHydration.default;
} 