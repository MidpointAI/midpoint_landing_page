"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedStatProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  accentNumber?: boolean;
  duration?: number;
}

// Memoized AnimatedStat to prevent unnecessary re-renders
const AnimatedStat = memo(function AnimatedStat({
  target,
  suffix = "",
  prefix = "",
  label,
  accentNumber = false,
  duration = 1500,
}: AnimatedStatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  const startCounting = useCallback(() => {
    // Clear any existing animation
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    // Reset to 0 and start
    setDisplayValue(0);
    setIsAnimating(true);

    // Calculate interval based on target and duration
    const stepTime = Math.max(duration / target, 10);
    let current = 0;

    animationRef.current = setInterval(() => {
      current += 1;
      setDisplayValue(current);

      if (current >= target) {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
        setIsAnimating(false);
      }
    }, stepTime);
  }, [target, duration]);

  // Start counting when in view - immediately on first visibility
  useEffect(() => {
    if (isInView && !hasStartedRef.current) {
      hasStartedRef.current = true;
      // Small delay to sync with fade-in animation
      const timer = setTimeout(() => {
        startCounting();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, startCounting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Handle hover - restart animation
  const handleMouseEnter = () => {
    if (!isAnimating) {
      startCounting();
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8 }}
      className="text-center cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
    >
      <div className="flex items-baseline justify-center">
        {prefix && (
          <span className="text-[2.5rem] sm:text-[4rem] text-primary">
            {prefix}
          </span>
        )}
        <span
          className={`text-[5rem] sm:text-[8rem] md:text-[10rem] font-extralight leading-none tracking-tighter font-mono tabular-nums ${
            accentNumber ? "text-primary" : "text-foreground"
          }`}
        >
          {displayValue}
        </span>
        <span
          className={`text-[2.5rem] sm:text-[4rem] ${
            accentNumber ? "text-foreground" : "text-primary"
          }`}
        >
          {suffix}
        </span>
      </div>
      <p className="text-sm tracking-[0.3em] uppercase text-muted mt-6">
        {label}
      </p>
    </motion.div>
  );
});

export default function StatsSection() {
  return (
    <section className="bg-background py-24 md:py-32 lg:py-[200px] px-6 border-t border-b border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
        <AnimatedStat target={98} suffix="%" label="Compliance Rate" duration={1200} />
        <AnimatedStat target={48} suffix="h" label="Average Verification" duration={1000} />
        <AnimatedStat
          target={2}
          suffix="M+"
          prefix="$"
          label="Exposure Prevented"
          accentNumber
          duration={600}
        />
      </div>
    </section>
  );
}
