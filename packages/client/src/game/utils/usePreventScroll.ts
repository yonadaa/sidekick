import { useEffect } from "react";

export function usePreventScroll() {
  useEffect(() => {
    const wheelListener = (event: WheelEvent) => {
      const target = event.target as HTMLElement;
      // Allow scrolling if the target or any of its parents has overflow-y-auto
      const isInScrollableArea = target.closest(".overflow-y-auto") !== null;
      // Allow scrolling in input elements or scrollable areas
      if (!(target instanceof HTMLInputElement) && !isInScrollableArea) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", wheelListener, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelListener);
    };
  }, []);
}
