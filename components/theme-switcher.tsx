"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon, type LucideIcon } from "lucide-react";

const OPTIONS: { value: "light" | "system" | "dark"; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "system", label: "System", icon: MonitorIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
];

/**
 * Segmented light / system / dark control for the site footer.
 * Renders a neutral placeholder until mounted so the server and client
 * markup match (next-themes only knows the theme on the client).
 */
export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // true on the client after hydration, false during SSR — no effect/setState needed
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const current = mounted ? theme ?? "system" : null;

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={`inline-flex items-center gap-0.5 rounded-full border border-border bg-background/60 p-0.5 ${className}`}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = current === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
            title={label}
            onClick={() => setTheme(value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              isActive
                ? "bg-secondary text-foreground"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
