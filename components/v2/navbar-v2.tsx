"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/v2/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileTextIcon,
  ChevronDownIcon,
  BookOpenIcon,
  MenuIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  description?: string;
  href: string;
}

interface MenuSection {
  category: string;
  items: MenuItem[];
}

const HOW_IT_WORKS = "/how-it-works";
const PRICING = "/pricing/how-it-works";
const CUSTOMERS = "/customers";

const resourcesMenu: MenuSection[] = [
  {
    category: "Learn",
    items: [
      { label: "Insurance Terms", icon: BookOpenIcon, description: "Plain-English guide to coverage terms", href: "/resources" },
    ],
  },
  {
    category: "Materials",
    items: [
      { label: "Proper Risk Transfer", icon: FileTextIcon, description: "Step-by-step guide, with PDF", href: "/resources/proper-risk-transfer" },
    ],
  },
];

type MenuKey = "resources";

interface MenuDef {
  key: MenuKey;
  label: string;
  sections: MenuSection[];
  /** Items per row inside each section. */
  columns: 1 | 2;
}

// Order matters: it decides which way the shared panel's content slides.
const MENUS: MenuDef[] = [
  { key: "resources", label: "Resources", sections: resourcesMenu, columns: 1 },
];

const PANEL_EASE = [0.25, 0.1, 0.25, 1] as const;

// Content slides toward the direction of travel: moving to a menu further
// right enters from the right and the old content exits left, and vice versa.
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 28 : dir < 0 ? -28 : 0, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -28 : dir < 0 ? 28 : 0, opacity: 0 }),
};

function MenuPanelContent({ menu, onNavigate }: { menu: MenuDef; onNavigate: () => void }) {
  return (
    <div className="flex gap-6">
      {menu.sections.map((section) => (
        <div key={section.category} className="flex-1 min-w-0">
          <p className="eyebrow mb-3">{section.category}</p>
          <div className={menu.columns === 2 ? "grid grid-cols-2 gap-1" : "space-y-1.5"}>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onNavigate}
                  className="flex items-start gap-3 px-4 py-3.5 rounded-lg text-left transition-colors hover:bg-secondary group w-full"
                >
                  <Icon className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors block whitespace-nowrap">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground/50 group-hover:text-muted-foreground transition-colors leading-snug mt-0.5 block">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NavbarV2() {
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [direction, setDirection] = useState(0);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelContentRef = useRef<HTMLDivElement | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    cancelClose();
    setActiveMenu(null);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeout.current = setTimeout(() => setActiveMenu(null), 150);
  }, [cancelClose]);

  const openMenu = useCallback(
    (key: MenuKey) => {
      cancelClose();
      setActiveMenu((current) => {
        if (current && current !== key) {
          const from = MENUS.findIndex((m) => m.key === current);
          const to = MENUS.findIndex((m) => m.key === key);
          setDirection(Math.sign(to - from));
        } else if (!current) {
          setDirection(0);
        }
        return key;
      });
    },
    [cancelClose]
  );

  // Keep the shared panel's height in step with whichever content is showing.
  useLayoutEffect(() => {
    const el = panelContentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setPanelHeight(el.offsetHeight));
    observer.observe(el);
    setPanelHeight(el.offsetHeight);
    return () => observer.disconnect();
  }, [activeMenu]);

  useEffect(() => {
    if (!activeMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeMenu, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* The blur sits on this bar, not on <header>: a backdrop filter would make the
          header the containing block for the fixed mobile overlay below and clip it.
          The bar is raised above that overlay so the logo and the menu toggle stay
          reachable while the menu is open. */}
      <div
        className="relative z-50 border-b border-border bg-background/90"
        style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
      >
      <div className="container-site h-16 flex items-center justify-between">
        <div className="flex items-center z-50">
          <Link href="/" className="focus:outline-none flex items-center" onClick={() => setMobileMenuOpen(false)}>
            <BrandLogo className="h-8" />
          </Link>
        </div>

        {/* Mobile header */}
        <div className="flex md:hidden items-center gap-3 z-50">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
          <Button asChild size="sm" className="ml-1">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contact us
            </Link>
          </Button>
        </div>

        {/* Desktop nav: triggers plus one shared panel */}
        <div
          className="hidden md:flex items-center gap-1 relative"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <Link
            href={HOW_IT_WORKS}
            onMouseEnter={closeMenu}
            className="px-3 py-1.5 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            How It Works
          </Link>
          <Link
            href={CUSTOMERS}
            onMouseEnter={closeMenu}
            className="px-3 py-1.5 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Customers
          </Link>

          {MENUS.map((menu) => {
            const isActive = activeMenu === menu.key;
            return (
              <button
                key={menu.key}
                type="button"
                aria-expanded={isActive}
                aria-controls="site-menu-panel"
                onMouseEnter={() => openMenu(menu.key)}
                onFocus={() => openMenu(menu.key)}
                onClick={() => (isActive ? closeMenu() : openMenu(menu.key))}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {menu.label}
                <ChevronDownIcon
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                />
              </button>
            );
          })}

          <Link
            href={PRICING}
            onMouseEnter={closeMenu}
            className="px-3 py-1.5 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Pricing
          </Link>

          <Button asChild size="sm" className="ml-3">
            <Link href="/contact" onMouseEnter={closeMenu}>
              Contact us
            </Link>
          </Button>

          <AnimatePresence>
            {activeMenu && (
              <motion.div
                id="site-menu-panel"
                key="panel"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1, height: panelHeight ?? "auto" }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{
                  duration: 0.18,
                  ease: PANEL_EASE,
                  height: { duration: 0.25, ease: PANEL_EASE },
                }}
                style={{ transformOrigin: "top right" }}
                className="absolute right-0 top-full mt-2 w-[560px] overflow-hidden rounded-xl bg-card border border-border shadow-2xl shadow-black/40"
              >
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  {MENUS.filter((m) => m.key === activeMenu).map((menu) => (
                    <motion.div
                      key={menu.key}
                      ref={panelContentRef}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.22, ease: PANEL_EASE }}
                      className="p-5"
                    >
                      <MenuPanelContent menu={menu} onNavigate={closeMenu} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 bg-background pt-16 overflow-y-auto"
          >
            <div className="px-6 py-8 space-y-6">
              <Link
                href={HOW_IT_WORKS}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-2xl font-semibold tracking-tight py-3 text-foreground"
              >
                How It Works
              </Link>

              <div className="border-t border-border pt-6">
                <Link
                  href={CUSTOMERS}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left text-2xl font-semibold tracking-tight py-3 text-foreground"
                >
                  Customers
                </Link>
              </div>

              <div className="border-t border-border pt-6">
                <button
                  onClick={() => setMobileResourcesOpen((v) => !v)}
                  className="flex items-center justify-between w-full text-2xl font-semibold tracking-tight text-foreground py-3"
                >
                  Resources
                  <ChevronDownIcon
                    className={`h-6 w-6 text-muted-foreground/70 transition-transform duration-300 ${
                      mobileResourcesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileResourcesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-2 space-y-8">
                        {resourcesMenu.map((section) => (
                          <div key={section.category} className="space-y-4">
                            <p className="eyebrow">
                              {section.category}
                            </p>
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-4 w-full text-left py-2"
                                >
                                  <Icon className="h-5 w-5 text-muted-foreground/70" />
                                  <span className="text-base text-foreground/80">{item.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-border pt-6">
                <Link
                  href={PRICING}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left text-2xl font-semibold tracking-tight py-3 text-foreground"
                >
                  Pricing
                </Link>
              </div>

              <div className="border-t border-border pt-6">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left text-2xl font-semibold tracking-tight py-3 text-foreground"
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
