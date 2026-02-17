"use client";

import { memo, useMemo } from "react";

// Memoized style objects to prevent recreation on each render
const FilmGrainOverlay = memo(function FilmGrainOverlay() {
  // Static styles - memoized to prevent recreation
  const grainStyle = useMemo(
    () => ({
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat" as const,
    }),
    []
  );

  const animatedGrainStyle = useMemo(
    () => ({
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='static'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.8' numOctaves='3' seed='1'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23static)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat" as const,
      willChange: "transform" as const,
    }),
    []
  );

  const scanLinesStyle = useMemo(
    () => ({
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
      backgroundSize: "100% 4px",
    }),
    []
  );

  const vignetteStyle = useMemo(
    () => ({
      background:
        "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
    }),
    []
  );

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      {/* Static Film Grain - no animation */}
      <div className="absolute inset-0 opacity-[0.035]" style={grainStyle} />

      {/* Animated TV Static - GPU accelerated with will-change */}
      <div
        className="absolute inset-0 opacity-[0.015] animate-grain motion-reduce:hidden"
        style={animatedGrainStyle}
      />

      {/* Scan Lines - static, no animation needed */}
      <div className="absolute inset-0 opacity-[0.03]" style={scanLinesStyle} />

      {/* Vignette - static gradient */}
      <div className="absolute inset-0" style={vignetteStyle} />
    </div>
  );
});

export default FilmGrainOverlay;
