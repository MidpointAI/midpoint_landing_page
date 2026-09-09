"use client";

import { motion } from "framer-motion";
import { StatusChip, PROJECT } from "@/components/v2/report";
import { reveal } from "./motion";

/**
 * The one thing a builder reads: this week's status email, drawn as a
 * message, not a dashboard. Everything above the summary happened without
 * them. Numbers and names are invented, matching the report kit.
 */

const SUMMARY = [
  { label: "Verified", value: "24 trade partners" },
  { label: "Expiring in 30 days", value: "3" },
  { label: "Missing a document", value: "2, being chased" },
  { label: "Needs your decision", value: "1" },
] as const;

const ITEMS = [
  {
    name: "Bluebird Roofing",
    detail: "Renewal requested 21 days out. Agent has the request.",
    status: "expiring" as const,
    label: "Expiring",
  },
  {
    name: "Redrock Drywall",
    detail: "Additional insured endorsement still missing. Third request sent.",
    status: "collecting" as const,
    label: "Chasing",
  },
  {
    name: "Copper Ridge Framing",
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
  return (
    <motion.div
      {...reveal(0.1)}
      className="w-full max-w-[560px] rounded-xl border border-border bg-card shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] overflow-hidden"
      role="figure"
      aria-label="Example of the weekly status email"
    >
      {/* Message header */}
      <div className="border-b border-border px-5 py-4 md:px-6 text-sm">
        <dl className="grid grid-cols-[3.5rem_1fr] gap-x-3 gap-y-1">
          <dt className="text-muted-foreground">From</dt>
          <dd className="text-foreground truncate">Midpoint &lt;service@midpointverified.com&gt;</dd>
          <dt className="text-muted-foreground">To</dt>
          <dd className="text-foreground">You</dd>
          <dt className="text-muted-foreground">Subject</dt>
          <dd className="font-medium text-foreground">
            Week of <span suppressHydrationWarning>{week}</span>: 24 verified, 3 expiring, 1 needs your call
          </dd>
        </dl>
      </div>

      {/* Body */}
      <div className="px-5 py-5 md:px-6 md:py-6 text-sm leading-relaxed text-foreground/90">
        <p>Here&apos;s where {PROJECT.name} stands this week. Nothing below needs a login.</p>

        <dl className="mt-5 divide-y divide-border border-y border-border">
          {SUMMARY.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-mono tabular-nums text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-5 space-y-3">
          {ITEMS.map((item) => (
            <li key={item.name} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-muted-foreground">{item.detail}</p>
              </div>
              <StatusChip
                status={item.status}
                label={item.status === "expiring" ? <span suppressHydrationWarning>{`${item.label} ${expires}`}</span> : item.label}
                className="mt-1 shrink-0"
              />
            </li>
          ))}
        </ul>

        <p className="mt-5 text-muted-foreground">
          Reply to this email with your decision on Copper Ridge, or we&apos;ll keep chasing.
          <br />
          Midpoint compliance team
        </p>
      </div>
    </motion.div>
  );
}
