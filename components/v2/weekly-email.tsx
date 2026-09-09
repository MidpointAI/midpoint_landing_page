"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import BrandLogo from "@/components/v2/brand-logo";
import { ComplianceRing, StatusChip, PROJECT } from "@/components/v2/report";
import { reveal, EASE } from "./motion";

/**
 * The one thing a builder reads: this week's status email, drawn as a
 * message with a report inside it. A score, a breakdown bar, three items
 * that need attention, and one button to the full report. Everything above
 * the summary happened without them. Numbers and names are invented,
 * matching the report kit.
 */

const REPORT_URL = "https://app.midpointverified.com";

const TOTAL = 30;

/** The roster this week, in the order the bar shows them. */
const BREAKDOWN = [
  { key: "verified", label: "Verified", count: 24, bar: "bg-primary", dot: "bg-primary" },
  { key: "expiring", label: "Expiring soon", count: 3, bar: "bg-chart-4", dot: "bg-chart-4" },
  { key: "missing", label: "Missing a doc", count: 2, bar: "bg-chart-4/50", dot: "bg-chart-4/50" },
  { key: "decision", label: "Needs your call", count: 1, bar: "bg-destructive", dot: "bg-destructive" },
] as const;

const ITEMS = [
  {
    name: "Bluebird Roofing",
    trade: "Roofing",
    detail: "Renewal requested 21 days out. Agent has the request.",
    status: "expiring" as const,
    label: "Expiring",
  },
  {
    name: "Redrock Drywall",
    trade: "Drywall",
    detail: "Additional insured endorsement still missing. Third request sent.",
    status: "collecting" as const,
    label: "Chasing",
  },
  {
    name: "Copper Ridge Framing",
    trade: "Framing",
    detail: "Waiver of subrogation excluded by their carrier. Hold, restrict, or accept?",
    status: "noncompliant" as const,
    label: "Your call",
  },
];

const SHORT_DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

/** Monday of the current week, e.g. "Sep 7". Computed on the client so it stays current. */
function weekOf(): string {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - ((day + 6) % 7));
  return d.toLocaleDateString("en-US", SHORT_DATE);
}

/** A date three weeks out, so the expiring row stays plausible. */
function expiresOn(): string {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toLocaleDateString("en-US", SHORT_DATE);
}

export default function WeeklyEmail() {
  const week = weekOf();
  const expires = expiresOn();
  const score = Math.round((BREAKDOWN[0].count / TOTAL) * 100);

  return (
    <motion.div
      {...reveal(0.1)}
      className="w-full max-w-[560px] rounded-xl border border-border bg-card shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] overflow-hidden"
      role="figure"
      aria-label="Example of the weekly status email"
    >
      {/* Message header */}
      <div className="border-b border-border px-5 py-3 md:px-6 text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          <span className="text-foreground/70">From</span> Midpoint
        </span>
        <span>
          <span className="text-foreground/70">To</span> You
        </span>
        <span className="ml-auto">
          Week of <span suppressHydrationWarning>{week}</span>
        </span>
      </div>

      {/* Report band: mark, title, score */}
      <div className="px-5 pt-5 md:px-6 md:pt-6 flex items-center gap-5">
        <ComplianceRing value={score} status="expiring" size={72} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <BrandLogo variant="mark" className="h-4 w-4" />
            <p className="eyebrow">Weekly compliance report</p>
          </div>
          <p className="text-base font-semibold text-foreground leading-tight truncate">{PROJECT.name}</p>
          <p className="text-sm text-muted-foreground">
            {BREAKDOWN[0].count} of {TOTAL} trade partners verified · {PROJECT.location}
          </p>
        </div>
      </div>

      {/* Breakdown bar and legend */}
      <div className="px-5 md:px-6 pt-5">
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-border/60" role="img" aria-label={`${BREAKDOWN.map((b) => `${b.count} ${b.label.toLowerCase()}`).join(", ")}`}>
          {BREAKDOWN.map((b, i) => (
            <motion.span
              key={b.key}
              className={`h-full ${b.bar}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${(b.count / TOTAL) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.08 }}
            />
          ))}
        </div>
        <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
          {BREAKDOWN.map((b) => (
            <div key={b.key} className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground leading-tight">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${b.dot}`} aria-hidden="true" />
                <span>{b.label}</span>
              </dt>
              <dd className="font-mono text-lg text-foreground tabular-nums leading-tight pl-3">{b.count}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Needs attention */}
      <div className="px-5 md:px-6 pt-5">
        <p className="eyebrow mb-2">Needs attention</p>
        <ul className="divide-y divide-border border-y border-border">
          {ITEMS.map((item) => (
            <li key={item.name} className="flex items-start justify-between gap-4 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {item.name} <span className="font-normal text-muted-foreground">· {item.trade}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
              </div>
              <StatusChip
                status={item.status}
                label={item.status === "expiring" ? <span suppressHydrationWarning>{`${item.label} ${expires}`}</span> : item.label}
                className="mt-0.5 shrink-0"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-5 py-5 md:px-6 md:py-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <a
          href={REPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          View the full report <ArrowRightIcon className="size-4" />
        </a>
        <p className="text-xs text-muted-foreground leading-snug">
          Every certificate and endorsement, filed by project. Or just reply to this email with your call on Copper Ridge.
        </p>
      </div>
    </motion.div>
  );
}
