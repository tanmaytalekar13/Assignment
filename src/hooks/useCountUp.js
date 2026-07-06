import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Animates a number from its previous value to `target` over `duration` ms. */
export function useCountUp(target, duration = 700) {
  const [display, setDisplay] = useState(target);
  const previous = useRef(target);
  const frame = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || typeof target !== "number" || Number.isNaN(target)) {
      setDisplay(target);
      previous.current = target;
      return undefined;
    }

    const start = previous.current;
    const delta = target - start;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + delta * eased);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        previous.current = target;
      }
    }

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}
