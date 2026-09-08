"use client";

import Link from "next/link";
import BrandLogo from "@/components/v2/brand-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Services have no dedicated pages yet; they point at the How It Works
// walkthrough, matching the navbar. Labels mirror the navbar's Services menu.
const HOW_IT_WORKS = "/how-it-works";
const SUPPORT_EMAIL = "service@midpointverified.com";

const footerColumns: FooterColumn[] = [
  {
    title: "Services",
    links: [
      { label: "COI Verification", href: HOW_IT_WORKS },
      { label: "Endorsement Review", href: HOW_IT_WORKS },
      { label: "Ongoing Monitoring", href: HOW_IT_WORKS },
      { label: "Sub Outreach", href: HOW_IT_WORKS },
      { label: "Audit Support", href: HOW_IT_WORKS },
      { label: "Risk Scoring", href: HOW_IT_WORKS },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insurance Terms", href: "/resources" },
      { label: "Proper Risk Transfer", href: "/resources/proper-risk-transfer" },
      { label: "Pricing", href: "/pricing/how-it-works" },
      { label: "Customers", href: "/customers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Email us", href: `mailto:${SUPPORT_EMAIL}` },
    ],
  },
];

export default function FooterV2() {
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="container-site pt-16 pb-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
          <div className="lg:w-[280px] lg:pr-8 flex-shrink-0">
            <Link href="/" className="inline-flex" aria-label="Midpoint home">
              <BrandLogo variant="mark" className="h-8 w-8" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              Insurance verification for builders. We collect, review, and monitor
              trade partner coverage so compliance stays off your plate.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-16 lg:ml-auto">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-medium text-foreground mb-5">{column.title}</p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("mailto:") ? (
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground/70 hover:text-foreground/80 transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground/70 hover:text-foreground/80 transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground/50">
            <p>111 E Monroe Ave, Buckeye, AZ 85396</p>
            <Link href="/privacy" className="hover:text-foreground/80 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground/80 transition-colors">Terms</Link>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <p className="text-sm text-muted-foreground/50">
              © {new Date().getFullYear()} Midpoint. All rights reserved.
            </p>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
