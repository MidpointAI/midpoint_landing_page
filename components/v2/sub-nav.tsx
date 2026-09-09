"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Secondary navigation for long pages, in the Stripe product-page pattern:
 * a slim bar that sticks under the main nav with the page name on the left
 * and its sections on the right. The section nearest the top of the viewport
 * is underlined as the reader scrolls. Sections need `scroll-mt-28` so the
 * two bars don't cover their headings when a link is followed.
 */
export interface SubNavItem {
  label: string;
  /** The id of the section, without the hash. */
  id: string;
  /** Shown beside the label only while this section is current, e.g. step ticks. */
  detail?: React.ReactNode;
}

/** Main nav (64px) plus this bar (44px) plus the hairline between them. */
const OFFSET = 64 + 44 + 1;

export function SubNav({ title, items }: { title: string; items: SubNavItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - OFFSET <= 8) current = item.id;
      }
      // At the bottom of the page the last section may never reach the bar,
      // so it is the active one by definition.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom && items.length ? items[items.length - 1].id : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // Follow a link with snapping suspended: on a page that snaps sections, a
  // long smooth scroll can be captured by a snap point on the way and stop short.
  const follow = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const html = document.documentElement;
    const snapped = html.classList.contains("snap-sections");
    html.classList.remove("snap-sections");
    const restore = () => {
      if (snapped) html.classList.add("snap-sections");
      window.removeEventListener("scrollend", restore);
    };
    window.addEventListener("scrollend", restore, { once: true });
    window.setTimeout(restore, 1500);
    history.pushState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // On narrow screens the link row scrolls sideways; keep the current item in view.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>("[aria-current]")?.closest("li");
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    const left = item.offsetLeft - list.offsetLeft;
    const right = left + item.offsetWidth;
    if (left < list.scrollLeft) list.scrollTo({ left: left - 16, behavior: "smooth" });
    else if (right > list.scrollLeft + list.clientWidth) list.scrollTo({ left: right - list.clientWidth + 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label={`${title} sections`} className="sticky top-16 z-30 border-b border-border bg-background/90" style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>
      <div className="container-site flex h-11 items-center gap-6">
        <p className="shrink-0 text-sm font-medium text-foreground">{title}</p>
        <ul ref={listRef} className="ml-auto flex h-full items-stretch gap-5 overflow-x-auto scrollbar-hide">
          {items.map((item) => {
            const on = item.id === active;
            return (
              <li key={item.id} className="flex shrink-0 items-center gap-3">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => follow(e, item.id)}
                  aria-current={on ? "location" : undefined}
                  className={`flex items-center border-b-2 text-sm transition-colors ${
                    on ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
                {on && item.detail ? <div className="flex items-center">{item.detail}</div> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
