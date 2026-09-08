"use client";

import { motion } from "framer-motion";
import { stats } from "./customer-stories-data";

/** Three verified numbers, right under the hero, so proof lands in the first scroll. */
export default function StatsStrip() {
  return (
    <section aria-label="Results" className="w-full border-y border-border bg-background">
      <div className="container-site grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 }}
            className="py-6 sm:py-7 sm:px-8 first:pl-0 last:pr-0 flex items-baseline gap-4"
          >
            <p className="text-3xl md:text-4xl font-semibold tracking-tight text-primary tabular-nums shrink-0">{stat.value}</p>
            <div className="min-w-0">
              <p className="text-sm text-foreground/90 leading-snug">{stat.label}</p>
              <p className="mt-1 eyebrow text-muted-foreground/70">{stat.source}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
