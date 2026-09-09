"use client";

import { motion } from "framer-motion";
import { stats } from "./customer-stories-data";
import { reveal } from "./motion";

/** Three verified numbers, right under the hero, so proof lands in the first scroll. */
export default function StatsStrip() {
  return (
    <section aria-label="Results" className="w-full bg-background">
      <div className="container-site border-y border-border grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...reveal(i * 0.05)}
            className="py-6 sm:py-7 sm:px-8 first:pl-0 last:pr-0"
          >
            <p className="text-3xl md:text-4xl font-semibold tracking-tight text-primary tabular-nums">{stat.value}</p>
            <p className="mt-2 text-sm text-foreground/90 leading-snug max-w-xs">{stat.label}</p>
            <p className="mt-1.5 eyebrow">{stat.source}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
