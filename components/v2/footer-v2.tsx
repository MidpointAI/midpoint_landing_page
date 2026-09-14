"use client";

import Link from "next/link";
import { APP_LOGIN_URL } from "@/lib/site";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Risk Transfer Process", href: "/resources" },
      { label: "One-Pager", href: "/one-pager" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Log in", href: APP_LOGIN_URL, external: true },
    ],
  },
];

export default function FooterV2() {
  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/60 dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
          <div className="lg:w-[200px] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v2/Mark.svg"
              alt="Midpoint"
              className="h-8 w-8 hidden dark:block"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(85%) sepia(47%) saturate(419%) hue-rotate(36deg) brightness(104%) contrast(101%)",
              }}
            />
            <img
              src="/v2/Mark.svg"
              alt="Midpoint"
              className="h-8 w-8 dark:hidden block"
              style={{
                filter: "brightness(0) saturate(100%)",
              }}
            />
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-medium text-zinc-900 dark:text-white mb-5">{column.title}</p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
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

        <div className="mt-16 pt-6 border-t border-zinc-200/60 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Midpoint Verified. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
