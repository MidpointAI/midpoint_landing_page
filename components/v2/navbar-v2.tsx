"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import BrandLogo from "@/components/v2/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheckIcon,
  FileTextIcon,
  BarChart3Icon,
  ChevronDownIcon,
  BookOpenIcon,
  CalculatorIcon,
  MessageSquareQuoteIcon,
  MailIcon,
  ClipboardListIcon,
  RefreshCwIcon,
  MenuIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";

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

// Services don't have dedicated pages yet, so each item points at the
// "How It Works" walkthrough on the home page, which covers all of them.
const HOW_IT_WORKS = "/#how-it-works";

const servicesMenu: MenuSection[] = [
  {
    category: "For General Contractors",
    items: [
      { label: "COI Verification", icon: ShieldCheckIcon, description: "Deep compliance checks on every sub", href: HOW_IT_WORKS },
      { label: "Endorsement Review", icon: FileTextIcon, description: "Verify actual policy endorsements", href: HOW_IT_WORKS },
      { label: "Ongoing Monitoring", icon: RefreshCwIcon, description: "Track expirations & renewals", href: HOW_IT_WORKS },
      { label: "Sub Outreach", icon: MailIcon, description: "We chase non-compliant subs for you", href: HOW_IT_WORKS },
      { label: "Audit Support", icon: ClipboardListIcon, description: "Pull documents on demand", href: HOW_IT_WORKS },
      { label: "Risk Scoring", icon: BarChart3Icon, description: "Score sub compliance at a glance", href: HOW_IT_WORKS },
    ],
  },
];

const resourcesMenu: MenuSection[] = [
  {
    category: "Learn",
    items: [
      { label: "Insurance Terms", icon: BookOpenIcon, description: "Plain-English guide to coverage terms", href: "/resources" },
      { label: "Success Stories", icon: MessageSquareQuoteIcon, description: "Hear from builders using Midpoint", href: "/#testimonials" },
    ],
  },
  {
    category: "Materials",
    items: [
      { label: "Proper Risk Transfer", icon: FileTextIcon, description: "Step-by-step guide, with PDF", href: "/resources/proper-risk-transfer" },
      { label: "How Pricing Works", icon: CalculatorIcon, description: "Transparent, formula-based pricing", href: "/pricing/how-it-works" },
    ],
  },
];

export default function NavbarV2() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleResourcesEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setResourcesOpen(true);
  };
  const handleResourcesLeave = () => {
    closeTimeout.current = setTimeout(() => setResourcesOpen(false), 150);
  };
  const handleServicesEnter = () => {
    if (servicesCloseTimeout.current) {
      clearTimeout(servicesCloseTimeout.current);
      servicesCloseTimeout.current = null;
    }
    setServicesOpen(true);
  };
  const handleServicesLeave = () => {
    servicesCloseTimeout.current = setTimeout(() => setServicesOpen(false), 150);
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md"
      style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-1.5 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors ml-1"
          >
            Contact us
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href={HOW_IT_WORKS}
            className="px-3 py-1.5 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            How It Works
          </Link>

          <div className="relative" onMouseEnter={handleServicesEnter} onMouseLeave={handleServicesLeave}>
            <button
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                servicesOpen ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Services
              <ChevronDownIcon
                className={`h-3.5 w-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute right-0 top-full mt-2 rounded-xl bg-card border border-border p-5 shadow-2xl shadow-black/40 w-[540px]"
                  style={{ transformOrigin: "top right" }}
                >
                  {servicesMenu.map((section) => (
                    <div key={section.category}>
                      <p className="text-muted-foreground/70 text-xs font-medium uppercase tracking-[0.15em] mb-3">
                        {section.category}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setServicesOpen(false)}
                              className="flex items-start gap-3 px-4 py-3.5 rounded-lg text-left transition-colors hover:bg-secondary group w-full"
                            >
                              <Icon className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors block">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" onMouseEnter={handleResourcesEnter} onMouseLeave={handleResourcesLeave}>
            <button
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                resourcesOpen ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Resources
              <ChevronDownIcon
                className={`h-3.5 w-3.5 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {resourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute right-0 top-full mt-2 rounded-xl bg-card border border-border p-6 shadow-2xl shadow-black/40 w-auto"
                  style={{ transformOrigin: "top right" }}
                >
                  <div className="flex gap-6">
                    {resourcesMenu.map((section) => (
                      <div key={section.category} className="flex-1 min-w-0">
                        <p className="text-muted-foreground/70 text-xs font-medium uppercase tracking-[0.15em] mb-3">
                          {section.category}
                        </p>
                        <div className="space-y-1.5">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            const inner = (
                              <>
                                <Icon className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors block whitespace-nowrap">
                                    {item.label}
                                  </span>
                                  {item.description && (
                                    <span className="text-xs text-muted-foreground/50 group-hover:text-muted-foreground transition-colors leading-snug mt-0.5 block">
                                      {item.description}
                                    </span>
                                  )}
                                </div>
                              </>
                            );
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setResourcesOpen(false)}
                                className="flex items-start gap-3 px-4 py-3.5 rounded-lg text-left transition-colors hover:bg-secondary group w-full"
                              >
                                {inner}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/contact"
            className="ml-3 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Contact us
          </Link>
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
            className="fixed inset-0 z-40 bg-background pt-20 overflow-y-auto"
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
                <button
                  onClick={() => setMobileServicesOpen((v) => !v)}
                  className="flex items-center justify-between w-full text-2xl font-semibold tracking-tight text-foreground py-3"
                >
                  Services
                  <ChevronDownIcon
                    className={`h-6 w-6 text-muted-foreground/70 transition-transform duration-300 ${
                      mobileServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-2 space-y-4">
                        {servicesMenu.map((section) => (
                          <div key={section.category} className="space-y-4">
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
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
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
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
