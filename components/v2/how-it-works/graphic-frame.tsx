"use client";

import { motion } from "framer-motion";

/** Every step graphic sits in the same frame so the page reads as one system. */
export default function GraphicFrame({
  isActive,
  label,
  children,
}: {
  isActive: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.figure
      aria-label={label}
      className="relative w-full max-w-[560px] rounded-xl border bg-card p-5 md:p-6 overflow-hidden"
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0.4,
        scale: isActive ? 1 : 0.98,
        borderColor: isActive ? "color-mix(in oklch, var(--primary) 40%, transparent)" : "var(--border)",
      }}
      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
    >
      {children}
    </motion.figure>
  );
}
