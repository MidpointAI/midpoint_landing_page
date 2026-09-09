"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, CopyIcon, Share2Icon, XIcon } from "lucide-react";
import OnePager, { ONE_PAGER_HEIGHT, ONE_PAGER_WIDTH } from "@/components/one-pager";
import { Button } from "@/components/ui/button";

const ONE_PAGER_PATH = "/one-pager";
const GUTTER = 24; // px, breathing room around the dialog
const ACTIONS = 56; // px, the action row floating under the sheet
const CLOSE = 48; // px, the close button; sits beside the sheet, or above it on narrow screens

/** Viewport size as an external store, so the sheet can refit without setState in an effect. */
function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
function useViewport() {
  return useSyncExternalStore(
    subscribe,
    () => `${window.innerWidth}x${window.innerHeight}`,
    () => "0x0"
  );
}

interface OnePagerOverlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The one-pager as a dismissable overlay. Escape, the backdrop, and the Close
 * button all dismiss it. The sheet is scaled to fit the viewport, so the
 * 612x916 layout never scrolls inside the dialog. Nothing is attached to the
 * sheet: Close floats beside its top corner and the actions float underneath.
 */
export function OnePagerOverlay({ open, onClose }: OnePagerOverlayProps) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const viewport = useViewport();

  const [vw, vh] = viewport.split("x").map(Number);
  const closeBeside = vw >= 640; // Tailwind sm, matching the sm:* classes below
  const scale =
    vw > 0
      ? Math.min(
          1,
          (vw - GUTTER * 2 - (closeBeside ? CLOSE * 2 : 0)) / ONE_PAGER_WIDTH,
          (vh - GUTTER * 2 - ACTIONS - (closeBeside ? 0 : CLOSE)) / ONE_PAGER_HEIGHT
        )
      : 1;

  // Escape closes; the page behind stops scrolling; focus moves in and back out.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${ONE_PAGER_PATH}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const share = useCallback(async () => {
    const url = `${window.location.origin}${ONE_PAGER_PATH}`;
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({
        title: "Understanding Midpoint",
        text: "How Midpoint handles subcontractor insurance compliance for builders.",
        url,
      });
    } catch {
      // The person closed the share sheet.
    }
  }, [copyLink]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="one-pager-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Understanding Midpoint, one-pager"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

          <motion.div
            className="relative"
            style={{ width: Math.round(ONE_PAGER_WIDTH * scale) }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Close floats at the sheet's top corner: beside it when there's room, above it when not */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close the one-pager"
              className="absolute right-0 -top-12 sm:top-0 sm:-right-12 flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer"
            >
              <XIcon className="size-4" />
            </button>

            {/* The sheet, scaled to fit */}
            <div
              className="overflow-hidden rounded-xl bg-white shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
              style={{ height: Math.round(ONE_PAGER_HEIGHT * scale) }}
            >
              <div
                style={{
                  width: ONE_PAGER_WIDTH,
                  height: ONE_PAGER_HEIGHT,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <OnePager />
              </div>
            </div>

            {/* Actions float under the sheet */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" className="bg-background shadow-md hover:bg-secondary" onClick={copyLink}>
                {copied ? <CheckIcon className="text-primary" /> : <CopyIcon />}
                {copied ? "Copied" : "Copy link"}
              </Button>
              <Button size="sm" variant="outline" className="bg-background shadow-md hover:bg-secondary" onClick={share}>
                <Share2Icon />
                Share
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
