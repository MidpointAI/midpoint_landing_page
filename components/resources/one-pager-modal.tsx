"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Share2, ExternalLink } from "lucide-react";
import OnePager from "@/components/one-pager";
import { Button } from "@/components/ui/button";

interface OnePagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnePagerModal({ isOpen, onClose }: OnePagerModalProps) {
  const [copied, setCopied] = useState(false);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/one-pager`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/one-pager`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "What is Midpoint?",
          text: "Learn how Midpoint helps builders manage insurance compliance.",
          url: url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  if (!isOpen) return null;

  // Scale factor for the preview
  const scale = 0.95;
  const previewWidth = Math.round(612 * scale);
  const previewHeight = Math.round(916 * scale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex flex-col max-h-[95vh] max-w-[95vw]">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-background/95 backdrop-blur-md rounded-t-xl border border-border/30 border-b-0 px-4 py-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Copy Link */}
            <Button size="xs" variant="outline" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="text-primary" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </Button>

            {/* Share */}
            <Button size="xs" variant="outline" onClick={handleShare}>
              <Share2 />
              <span className="hidden sm:inline">Share</span>
            </Button>

            {/* Open Full Size */}
            <Button size="xs" asChild>
              <a href="/one-pager" target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                <span className="hidden sm:inline">Open Full Size</span>
              </a>
            </Button>
          </div>
        </div>

        {/* One-pager preview container */}
        <div className="overflow-auto bg-background/95 backdrop-blur-md rounded-b-xl border border-border/30 border-t-0 p-4 sm:p-6">
          <div
            className="mx-auto overflow-hidden rounded-lg border border-border/40 shadow-[0_28px_90px_rgba(0,0,0,0.52)]"
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
            }}
          >
            <div
              style={{
                width: "612px",
                height: "916px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <OnePager embedded />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
