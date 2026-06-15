"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Shared scroll-driven step activity tracker.
 *
 * Any element that registers itself via `useStepActivity(id)` becomes part
 * of a single page-wide pool. The provider runs ONE scroll listener that
 * picks whichever registered element's center is closest to the viewport
 * midpoint and marks it as active. Everything else is inactive.
 *
 * This means only one step is ever highlighted at a time across the whole
 * page (Step 1 hero + Steps 2–5 in WhatWeDoSteps), and animations that
 * are driven by `isActive` reverse cleanly when the user scrolls back up.
 */

type Ctx = {
  register: (id: string, el: HTMLElement | null) => void;
  unregister: (id: string) => void;
  activeId: string | null;
};

const StepActivityContext = createContext<Ctx | null>(null);

export function StepActivityProvider({ children }: { children: React.ReactNode }) {
  const steps = useRef<Map<string, HTMLElement>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);

  const pickClosest = useCallback(() => {
    const mid = window.innerHeight / 2;
    let bestId: string | null = null;
    let bestDist = Infinity;

    steps.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      // Only consider steps that are at least partially in the viewport
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const dist = Math.abs(rect.top + rect.height / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        bestId = id;
      }
    });

    setActiveId((prev) => (prev === bestId ? prev : bestId));
  }, []);

  // Re-run pickClosest whenever a step registers/unregisters — the initial
  // run inside useEffect happens BEFORE children mount, so without this the
  // active step stays null until the user scrolls.
  const register = useCallback(
    (id: string, el: HTMLElement | null) => {
      if (!el) return;
      steps.current.set(id, el);
      // Defer to next frame so layout has settled.
      requestAnimationFrame(pickClosest);
    },
    [pickClosest]
  );

  const unregister = useCallback(
    (id: string) => {
      steps.current.delete(id);
      requestAnimationFrame(pickClosest);
    },
    [pickClosest]
  );

  useEffect(() => {
    // rAF-throttle the scroll handler. pickClosest calls
    // getBoundingClientRect() on every registered step (each one forces a
    // synchronous layout/reflow). Scroll fires very frequently and the
    // landing page also runs several framer-motion useScroll/useTransform
    // parallax layers, so coalescing measurement to at most one per frame
    // keeps things smooth on lower-end devices.
    let rafId: number | null = null;
    const schedulePick = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        pickClosest();
      });
    };

    // Defer the initial pick to the next frame so we don't trigger a
    // cascading render on mount (children haven't registered yet anyway).
    const initialRaf = requestAnimationFrame(pickClosest);
    window.addEventListener("scroll", schedulePick, { passive: true });
    window.addEventListener("resize", schedulePick);
    return () => {
      cancelAnimationFrame(initialRaf);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedulePick);
      window.removeEventListener("resize", schedulePick);
    };
  }, [pickClosest]);

  return (
    <StepActivityContext.Provider value={{ register, unregister, activeId }}>
      {children}
    </StepActivityContext.Provider>
  );
}

/**
 * Register an element with the provider and observe its active state.
 * Attach the returned `ref` to the wrapper of whatever you're tracking.
 *
 *   const { ref, isActive } = useStepActivity("step-3");
 *   return <section ref={ref}>…</section>;
 */
export function useStepActivity(id: string) {
  const ctx = useContext(StepActivityContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctx) return;
    ctx.register(id, ref.current);
    return () => ctx.unregister(id);
  }, [ctx, id]);

  return {
    ref,
    isActive: ctx?.activeId === id,
  };
}
