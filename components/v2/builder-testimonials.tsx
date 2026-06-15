"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const testimonials = [
  {
    quote:
      "Before signing on, we didn't have subcontractor agreements in place, and only about 10% of trade partners carried the required insurance. Now every trade partner has an executed agreement and we're sitting at 98% compliance. It's streamlined, accountable, and a big win for our risk management.",
    name: "Andy Becker",
    title: "CEO",
    company: "Stonegate Homes",
  },
  {
    quote:
      "Since Midpoint has taken over and streamlined our compliance requirements, it has significantly reduced preparation time and stress during insurance audits and also our day to day tracking. I would definitely recommend this service to any company",
    name: "Samantha Becher",
    title: "Office & Finance Manager",
    company: "Starwood Custom Homes",
  },
  {
    quote:
      "Working with Midpoint has been a game-changer for us. Their approach has reduced time spent managing the compliance process as well as dramatically reducing our exposure and insurance premiums.",
    name: "Spencer Nield",
    title: "Director of Operations",
    company: "A Finer Touch Construction",
  },
];

function getPosition(index: number, activeIndex: number): "left" | "center" | "right" {
  const len = testimonials.length;
  if (index === activeIndex) return "center";
  if ((activeIndex + 1) % len === index) return "right";
  return "left";
}

const positionConfig = {
  left: { x: "-40%", z: -120, scale: 0.88, opacity: 0.55, blur: 1, zIndex: 1 },
  center: { x: "0%", z: 0, scale: 1, opacity: 1, blur: 0, zIndex: 3 },
  right: { x: "40%", z: -120, scale: 0.88, opacity: 0.55, blur: 1, zIndex: 1 },
};

export default function BuilderTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax layers at different rates
  const carouselY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  // Exit: scale down + blur as you leave
  const sectionScale = useTransform(scrollYProgress, [0.7, 1], [1, 0.92]);
  const sectionOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(advance, 20000);
    return () => clearInterval(timer);
  }, [isPaused, advance]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 20000);
  };

  return (
    <section ref={sectionRef} className="w-full bg-white dark:bg-zinc-950 py-24 pt-[110px] pb-[110px] md:min-h-[100dvh] md:snap-start md:flex md:flex-col md:justify-center overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 md:px-6"
        style={{ scale: sectionScale, opacity: sectionOpacity }}
      >
        <motion.div
          className="text-center mb-16"
          style={{ y: titleY }}
          initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 60, filter: "blur(8px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg">
            Real stories from contractors who transformed their risk management
          </p>
        </motion.div>

        <motion.div
          className="relative w-full max-w-2xl mx-auto"
          style={{ perspective: "1200px", perspectiveOrigin: "50% 50%", y: carouselY }}
          initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
          animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.7, filter: "blur(12px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div className="relative" style={{ minHeight: "320px" }}>
            {testimonials.map((testimonial, index) => {
              const position = getPosition(index, activeIndex);
              const config = positionConfig[position];
              const isActive = position === "center";
              return (
                <motion.div
                  key={index}
                  className="absolute inset-0 cursor-pointer select-none"
                  animate={{
                    x: config.x,
                    z: config.z,
                    scale: config.scale,
                    opacity: config.opacity,
                    filter: `blur(${config.blur}px)`,
                    zIndex: config.zIndex,
                  }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                  onClick={() => handleClick(index)}
                >
                  <div className="rounded-xl bg-zinc-50/90 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-800/50 p-8 md:p-10 h-full flex flex-col justify-center">
                    <p
                      className={`italic text-base md:text-lg leading-relaxed mb-6 text-center ${
                        isActive ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="text-center">
                      <p
                        className={`text-base font-medium mb-1 ${
                          isActive ? "text-lime-600 dark:text-lime-400" : "text-zinc-400 dark:text-zinc-600"
                        }`}
                      >
                        {testimonial.name}
                      </p>
                      <p className="text-xs font-medium tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                        {testimonial.title}
                      </p>
                      <p
                        className={`text-xs font-medium tracking-wider uppercase ${
                          isActive ? "text-lime-600/60 dark:text-lime-400/60" : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      >
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center gap-2 mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "w-6 bg-lime-400"
                  : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500"
              }`}
              aria-label={`Show testimonial ${index + 1}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
