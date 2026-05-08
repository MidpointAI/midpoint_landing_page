"use client";

import Link from "next/link";

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
      { label: "How It Works", href: "/pricing/how-it-works" },
      { label: "Risk Transfer Process", href: "/resources" },
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
    <footer className="w-full bg-zinc-950 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
          <div className="lg:w-[200px] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v2/Mark.svg"
              alt="Midpoint"
              className="h-8 w-8"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(85%) sepia(47%) saturate(419%) hue-rotate(36deg) brightness(104%) contrast(101%)",
              }}
            />
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-medium text-white mb-5">{column.title}</p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span className="text-sm text-zinc-500 cursor-default">
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

        <div className="mt-16 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm text-zinc-600">Privacy</span>
            <span className="text-sm text-zinc-600">Terms</span>
            <span className="text-sm text-zinc-600">DPA</span>
          </div>
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Midpoint Verified. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
