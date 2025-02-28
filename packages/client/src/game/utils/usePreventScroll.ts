import { useEffect } from "react";

export function usePreventScroll() {
  useEffect(() => {
    const wheelListener = (event: WheelEvent) => {
      const target = event.target as HTMLElement;
      const scrollableParent = target.closest(".overflow-y-auto");

      if (scrollableParent) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableParent;
        const isScrollingUp = event.deltaY < 0;
        const isScrollingDown = event.deltaY > 0;

        // Prevent scrolling up when at top
        if (isScrollingUp && scrollTop <= 0) {
          event.preventDefault();
          return;
        }

        // Prevent scrolling down when at bottom
        if (isScrollingDown && scrollTop + clientHeight >= scrollHeight) {
          event.preventDefault();
          return;
        }

        // Allow scrolling within the container
        return;
      }

      // Prevent scrolling if not in an input element
      if (!(target instanceof HTMLInputElement)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", wheelListener, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelListener);
    };
  }, []);
}
