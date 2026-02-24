"use client";

import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export function DocsHeader({
  onMenuToggle,
  isMobileMenuOpen,
}: {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-4 lg:px-6">
      {/* Left section: hamburger, logo, breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-secondary transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-4 h-4 text-foreground" />
          ) : (
            <Menu className="w-4 h-4 text-foreground" />
          )}
        </button>
        <div className="flex items-center gap-2.5">
          <a href="/" className="flex items-center gap-2.5">
            <Image
              src="/midpoint-logo.png"
              alt="Midpoint"
              width={100}
              height={16}
              className="h-4 w-auto dark:brightness-0 dark:invert"
              priority
            />
          </a>
          <span className="hidden sm:inline text-muted-foreground/40 text-sm">/</span>
          <span className="hidden sm:inline text-sm text-muted-foreground">Resources</span>
        </div>
      </div>

      {/* Center section: search */}
      <div className="flex-1 flex justify-center px-4">
        <div className={`relative w-full max-w-sm transition-all duration-200 ${searchFocused ? "max-w-md" : ""}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search terms..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-8 bg-secondary/60 border border-border/50 rounded-lg pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:bg-secondary transition-all duration-200"
          />
          <kbd className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] text-muted-foreground/40 font-mono border border-border/30 rounded px-1.5 py-0.5">
            {"/"}
          </kbd>
        </div>
      </div>

      {/* Right section: links, theme toggle, avatar */}
      <div className="hidden md:flex items-center gap-1">
        <a
          href="/"
          className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
        >
          Platform
        </a>
        <a
          href="/contact"
          className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
        >
          Contact
        </a>
        <div className="ml-2">
          <ThemeToggle />
        </div>
        <div className="ml-2 w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-[10px] font-medium text-primary">GC</span>
        </div>
      </div>

      {/* Mobile: just theme toggle */}
      <div className="flex md:hidden items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
