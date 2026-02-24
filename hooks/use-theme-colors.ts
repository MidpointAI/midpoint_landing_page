"use client";

import { useState, useEffect, useCallback } from "react";

interface ShaderColors {
  colorBack: string;
  colors: string[];
}

/**
 * Converts any CSS color string to hex format
 * Supports: oklch(), rgb(), rgba(), color(srgb), hex
 */
function colorToHex(colorStr: string): string {
  const trimmed = colorStr.trim();

  // Already hex
  if (trimmed.startsWith("#")) {
    return trimmed.length === 4
      ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
      : trimmed;
  }

  // RGB/RGBA format: rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = trimmed.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (rgbMatch) {
    const r = Math.round(parseFloat(rgbMatch[1]));
    const g = Math.round(parseFloat(rgbMatch[2]));
    const b = Math.round(parseFloat(rgbMatch[3]));
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // color(srgb r g b) format (values 0-1)
  const srgbMatch = trimmed.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (srgbMatch) {
    const r = Math.round(parseFloat(srgbMatch[1]) * 255);
    const g = Math.round(parseFloat(srgbMatch[2]) * 255);
    const b = Math.round(parseFloat(srgbMatch[3]) * 255);
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // OKLCH format: oklch(L C H) or oklch(L C H / alpha)
  const oklchMatch = trimmed.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (oklchMatch) {
    return oklchToHex(
      parseFloat(oklchMatch[1]),
      parseFloat(oklchMatch[2]),
      parseFloat(oklchMatch[3])
    );
  }

  // Fallback to black
  console.warn("Unknown color format:", trimmed);
  return "#000000";
}

/**
 * Converts OKLCH values to hex format
 */
function oklchToHex(L: number, C: number, H: number): string {
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

  // Clamp and convert to hex
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
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

  if (!value) return "#000000";

  return colorToHex(value);
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
