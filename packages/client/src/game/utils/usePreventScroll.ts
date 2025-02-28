import { useEffect } from "react";

export function usePreventScroll() {
  useEffect(() => {
    const wheelListener = (event: WheelEvent) => {
      // Only prevent scrolling if not in an input element
      if (!(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", wheelListener, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelListener);
    };
  }, []);
}
