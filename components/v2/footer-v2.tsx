"use client";

import Link from "next/link";
import BrandLogo from "@/components/v2/brand-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Services",
    links: [
      { label: "COI Verification" },
      { label: "Endorsement Review" },
      { label: "Compliance Monitoring" },
      { label: "Audit Support" },
      { label: "Sub Outreach" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insurance Terms", href: "/resources" },
      { label: "Proper Risk Transfer", href: "/resources/proper-risk-transfer" },
      { label: "How Pricing Works", href: "/pricing/how-it-works" },
      { label: "Success Stories" },
      { label: "Blog" },
      { label: "ROI Calculator" },
      { label: "Video Walkthroughs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About" },
      { label: "Careers" },
      { label: "Contact", href: "/contact" },
      { label: "Partners" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
      { label: "Security" },
    ],
  },
];

export default function FooterV2() {
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="container-site pt-16 pb-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
          <div className="lg:w-[260px] lg:pr-8 flex-shrink-0">
            <Link href="/" className="inline-flex" aria-label="Midpoint home">
              <BrandLogo variant="mark" className="h-8 w-8" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              Insurance verification for builders. We collect, review, and monitor
              trade partner coverage so compliance stays off your plate.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-medium text-foreground mb-5">{column.title}</p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground/70 hover:text-foreground/80 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground/70 cursor-default">
                          {link.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground/50">Privacy</span>
            <span className="text-sm text-muted-foreground/50">Terms</span>
            <span className="text-sm text-muted-foreground/50">DPA</span>
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
