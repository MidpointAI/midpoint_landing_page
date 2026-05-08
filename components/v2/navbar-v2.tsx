"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheckIcon,
  FileTextIcon,
  BarChart3Icon,
  ChevronDownIcon,
  BookOpenIcon,
  NewspaperIcon,
  VideoIcon,
  CalculatorIcon,
  ClipboardCheckIcon,
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
  href?: string;
}

interface MenuSection {
  category: string;
  items: MenuItem[];
}

const servicesMenu: MenuSection[] = [
  {
    category: "For General Contractors",
    items: [
      { label: "COI Verification", icon: ShieldCheckIcon, description: "Deep compliance checks on every sub" },
      { label: "Endorsement Review", icon: FileTextIcon, description: "Verify actual policy endorsements" },
      { label: "Ongoing Monitoring", icon: RefreshCwIcon, description: "Track expirations & renewals" },
      { label: "Sub Outreach", icon: MailIcon, description: "We chase non-compliant subs for you" },
      { label: "Audit Support", icon: ClipboardListIcon, description: "Pull documents on demand" },
      { label: "Risk Scoring", icon: BarChart3Icon, description: "Score sub compliance at a glance" },
    ],
  },
];

const resourcesMenu: MenuSection[] = [
  {
    category: "Learn",
    items: [
      { label: "Blog", icon: NewspaperIcon, description: "Latest insights and updates" },
      { label: "Success Stories", icon: BookOpenIcon, description: "See how we've saved thousands" },
      { label: "Video Walkthroughs", icon: VideoIcon, description: "See Midpoint in action" },
      { label: "ROI Calculator", icon: CalculatorIcon, description: "Estimate your savings" },
    ],
  },
  {
    category: "Materials",
    items: [
      { label: "Proper Risk Transfer", icon: FileTextIcon, description: "Download the PDF guide", href: "/resources" },
      { label: "Compliance Checklist", icon: ClipboardCheckIcon, description: "Verify your coverage", href: "/resources" },
    ],
  },
];

interface NavbarV2Props {
  onQuoteClick: () => void;
}

export default function NavbarV2({ onQuoteClick }: NavbarV2Props) {
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
      className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-zinc-950/85 backdrop-blur-md"
      style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center z-50">
          <Link href="/" className="focus:outline-none flex items-center" onClick={() => setMobileMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v2/Property_1Frame_2.svg"
              alt="Midpoint"
              className="h-8 max-w-[180px] object-left object-contain"
            />
          </Link>
        </div>

        {/* Mobile header */}
        <div className="flex md:hidden items-center gap-3 z-50">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onQuoteClick();
            }}
            className="px-4 py-1.5 text-sm font-medium text-zinc-950 bg-lime-400 rounded-full hover:bg-lime-300 transition-colors ml-1"
          >
            Get a quote
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <a
            href="#how-it-works"
            className="px-3 py-1.5 text-sm font-medium rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            How It Works
          </a>

          <div className="relative" onMouseEnter={handleServicesEnter} onMouseLeave={handleServicesLeave}>
            <button
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                servicesOpen ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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
                  className="absolute right-0 top-full mt-2 rounded-xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl shadow-black/40 w-[540px]"
                  style={{ transformOrigin: "top right" }}
                >
                  {servicesMenu.map((section) => (
                    <div key={section.category}>
                      <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.15em] mb-3">
                        {section.category}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              className="flex items-start gap-3 px-4 py-3.5 rounded-lg text-left transition-colors hover:bg-zinc-800 group w-full"
                            >
                              <Icon className="h-4 w-4 text-zinc-500 group-hover:text-lime-400 transition-colors flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors block">
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors leading-snug mt-0.5 block">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </button>
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
                resourcesOpen ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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
                  className="absolute right-0 top-full mt-2 rounded-xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl shadow-black/40 w-auto"
                  style={{ transformOrigin: "top right" }}
                >
                  <div className="flex gap-6">
                    {resourcesMenu.map((section) => (
                      <div key={section.category} className="flex-1 min-w-0">
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.15em] mb-3">
                          {section.category}
                        </p>
                        <div className="space-y-1.5">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            const inner = (
                              <>
                                <Icon className="h-4 w-4 text-zinc-500 group-hover:text-lime-400 transition-colors flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors block whitespace-nowrap">
                                    {item.label}
                                  </span>
                                  {item.description && (
                                    <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors leading-snug mt-0.5 block">
                                      {item.description}
                                    </span>
                                  )}
                                </div>
                              </>
                            );
                            return item.href ? (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-start gap-3 px-4 py-3.5 rounded-lg text-left transition-colors hover:bg-zinc-800 group w-full"
                              >
                                {inner}
                              </Link>
                            ) : (
                              <button
                                key={item.label}
                                type="button"
                                className="flex items-start gap-3 px-4 py-3.5 rounded-lg text-left transition-colors hover:bg-zinc-800 group w-full"
                              >
                                {inner}
                              </button>
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
            className="px-3 py-1.5 text-sm font-medium text-zinc-400 rounded-full hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Contact
          </Link>
          <button
            onClick={onQuoteClick}
            className="ml-3 px-4 py-1.5 text-sm font-medium text-white border border-zinc-700 rounded-full hover:bg-zinc-800 transition-colors"
          >
            Get a quote
          </button>
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
            className="fixed inset-0 z-40 bg-zinc-950 pt-20 overflow-y-auto"
          >
            <div className="px-6 py-8 space-y-6">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-2xl font-semibold tracking-tight py-3 text-white"
              >
                How It Works
              </a>

              <div className="border-t border-white/[0.06] pt-6">
                <button
                  onClick={() => setMobileServicesOpen((v) => !v)}
                  className="flex items-center justify-between w-full text-2xl font-semibold tracking-tight text-white py-3"
                >
                  Services
                  <ChevronDownIcon
                    className={`h-6 w-6 text-zinc-500 transition-transform duration-300 ${
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
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                              {section.category}
                            </p>
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.label}
                                  type="button"
                                  className="flex items-center gap-4 w-full text-left py-2"
                                >
                                  <Icon className="h-5 w-5 text-zinc-500" />
                                  <span className="text-base text-zinc-300">{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-white/[0.06] pt-6">
                <button
                  onClick={() => setMobileResourcesOpen((v) => !v)}
                  className="flex items-center justify-between w-full text-2xl font-semibold tracking-tight text-white py-3"
                >
                  Resources
                  <ChevronDownIcon
                    className={`h-6 w-6 text-zinc-500 transition-transform duration-300 ${
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
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                              {section.category}
                            </p>
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              return item.href ? (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-4 w-full text-left py-2"
                                >
                                  <Icon className="h-5 w-5 text-zinc-500" />
                                  <span className="text-base text-zinc-300">{item.label}</span>
                                </Link>
                              ) : (
                                <button
                                  key={item.label}
                                  type="button"
                                  className="flex items-center gap-4 w-full text-left py-2"
                                >
                                  <Icon className="h-5 w-5 text-zinc-500" />
                                  <span className="text-base text-zinc-300">{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-white/[0.06] pt-6">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left text-2xl font-semibold tracking-tight py-3 text-white"
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
