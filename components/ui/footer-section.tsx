"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const quickLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Sign Up", href: "/contact" },
];

const resourceLinks = [
  { label: "Resources", href: "/resources" },
  { label: "Case Studies", href: "/resources" },
  { label: "Glossary", href: "/resources" },
  { label: "Common questions", href: "/#faq" },
];

const socialLinks = [
  { label: "Facebook", icon: Facebook },
  { label: "Instagram", icon: Instagram },
  { label: "X", icon: Twitter },
  { label: "LinkedIn", icon: Linkedin },
  { label: "YouTube", icon: Youtube },
];

function Footerdemo() {
  return (
    <footer className="border-t border-border/70 bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex">
              <Image
                src="/Midpoint-Logo.svg"
                alt="Midpoint"
                width={184}
                height={44}
                className="h-9 w-auto dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
              Midpoint helps builders centralize onboarding, review
              certificates, and keep insurance compliance moving without
              paperwork drag.
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Quick Links
              </p>
              <nav className="mt-5 grid gap-3 text-sm">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="w-fit transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Resources
              </p>
              <nav className="mt-5 grid gap-3 text-sm">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="w-fit transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border/70 pt-6 md:flex-row md:items-center md:justify-between">
          <TooltipProvider delayDuration={0}>
            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Tooltip key={social.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full border border-transparent text-muted-foreground hover:border-border/70 hover:bg-muted/40 hover:text-primary"
                        asChild
                      >
                        <a href="#" aria-label={social.label}>
                          <Icon className="h-4 w-4" />
                          <span className="sr-only">{social.label}</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>

          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Midpoint. All rights reserved.
            </p>

            <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                Cookies Settings
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footerdemo };
