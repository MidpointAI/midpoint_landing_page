"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MonitorIcon, SunIcon, MoonIcon } from "lucide-react";

const modes = [
  { value: "system", label: "Auto", Icon: MonitorIcon },
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Deferred so we don't synchronously setState in the mount effect (the
  // standard next-themes hydration guard).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return null;

  const activeIndex = modes.findIndex((m) => m.value === theme);
  const idx = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-1 shadow-lg shadow-black/5 dark:shadow-black/20">
      {modes.map((mode, i) => {
        const isActive = i === idx;
        return (
          <button
            key={mode.value}
            aria-label={`Switch to ${mode.label} mode`}
            onClick={() => setTheme(mode.value)}
            className={`relative flex items-center justify-center h-7 w-7 rounded-full transition-colors duration-200 ${
              isActive
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <mode.Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
