import { useState, useEffect } from "react";

export default function useIsTouch() {
  // Default to true (or false) for SSR, but true is often safer for desktop-first contexts
  // Alternatively, just start with false to strictly require the capability to be proven.
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");

    // Set initial value
    setIsTouch(mediaQuery.matches);

    // Listen for changes (e.g., user plugs in a mouse to a tablet)
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);

    // Use modern addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
    // Fallback for older browsers if needed
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  return isTouch;
}
