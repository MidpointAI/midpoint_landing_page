/**
 * One motion vocabulary for the site.
 *
 * Layout entrances are all the same move: an 8px rise and fade as the
 * element scrolls into view, once. State changes inside product demos use
 * the one spring. Nothing else animates on its own.
 */
export const EASE = [0.25, 0.1, 0.25, 1] as const;

/** Entrance for any block of layout. Stagger siblings with `delay` in 0.05s steps. */
export function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-64px" },
    transition: { duration: 0.4, ease: EASE, delay },
  } as const;
}

/** The same entrance, driven by a boolean instead of the viewport. */
export function revealWhen(on: boolean, delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    transition: { duration: 0.4, ease: EASE, delay },
  } as const;
}

/** State changes inside product demos: rows, chips, panels. */
export const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;
