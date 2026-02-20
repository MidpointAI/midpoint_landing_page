"use client";

import { useState, useEffect, useCallback } from "react";

interface ShaderColors {
  colorBack: string;
  colors: string[];
}

/**
 * Converts an OKLCH color string to hex format
 * OKLCH format: oklch(L C H) where L is lightness (0-1), C is chroma (0-0.4), H is hue (0-360)
 */
function oklchToHex(oklchStr: string): string {
  // Parse oklch(L C H) format
  const match = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) {
    // If it's already a hex color, return it
    if (oklchStr.startsWith("#")) return oklchStr;
    // Fallback to black
    return "#000000";
  }

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // Convert OKLCH to OKLab
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  // Convert OKLab to linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Linear sRGB to sRGB
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bVal = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // Gamma correction
  const gammaCorrect = (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return x <= 0.0031308
      ? 12.92 * x
      : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  };

  r = Math.round(gammaCorrect(r) * 255);
  g = Math.round(gammaCorrect(g) * 255);
  bVal = Math.round(gammaCorrect(bVal) * 255);

  // Clamp values
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  bVal = Math.max(0, Math.min(255, bVal));

  // Convert to hex
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(bVal)}`;
}

/**
 * Reads a CSS variable value and converts it to hex
 */
function getCSSVariableAsHex(variableName: string): string {
  if (typeof window === "undefined") return "#000000";

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  return oklchToHex(value);
}

/**
 * Hook that provides theme-reactive shader colors
 * Watches for CSS variable changes and returns hex colors for WebGL shaders
 */
export function useThemeColors(): ShaderColors {
  const [colors, setColors] = useState<ShaderColors>({
    colorBack: "#020504",
    colors: ["#020a08", "#0d2818", "#1a4525", "#2d6b3f", "#4a9960", "#C9FF64"],
  });

  const updateColors = useCallback(() => {
    const newColors: ShaderColors = {
      colorBack: getCSSVariableAsHex("--shader-bg"),
      colors: [
        getCSSVariableAsHex("--shader-1"),
        getCSSVariableAsHex("--shader-2"),
        getCSSVariableAsHex("--shader-3"),
        getCSSVariableAsHex("--shader-4"),
        getCSSVariableAsHex("--shader-5"),
        getCSSVariableAsHex("--shader-6"),
      ],
    };
    setColors(newColors);
  }, []);

  useEffect(() => {
    // Initial color read
    updateColors();

    // Watch for style changes on :root (theme switches)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "style" ||
            mutation.attributeName === "class")
        ) {
          updateColors();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Also listen for custom theme change events (from tweakcn)
    const handleThemeChange = () => updateColors();
    window.addEventListener("themechange", handleThemeChange);

    // Poll for changes as a fallback (tweakcn may update styles directly)
    const pollInterval = setInterval(updateColors, 500);

    return () => {
      observer.disconnect();
      window.removeEventListener("themechange", handleThemeChange);
      clearInterval(pollInterval);
    };
  }, [updateColors]);

  return colors;
}
