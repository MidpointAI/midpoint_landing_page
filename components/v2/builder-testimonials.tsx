"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <section id="testimonials" className="w-full bg-background py-24 pt-[110px] pb-[110px] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-muted-foreground text-base md:text-lg">
            Real stories from contractors who transformed their risk management
          </p>
        </div>

        <div
          className="relative w-full max-w-2xl mx-auto"
          style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
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
                  <div className="rounded-xl bg-card/90 border border-border/50 p-8 md:p-10 h-full flex flex-col justify-center">
                    <p
                      className={`italic text-base md:text-lg leading-relaxed mb-6 text-center ${
                        isActive ? "text-foreground/90" : "text-muted-foreground/70"
                      }`}
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="text-center">
                      <p
                        className={`text-base font-medium mb-1 ${
                          isActive ? "text-primary" : "text-muted-foreground/50"
                        }`}
                      >
                        {testimonial.name}
                      </p>
                      <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground/70">
                        {testimonial.title}
                      </p>
                      <p
                        className={`text-xs font-medium tracking-wider uppercase ${
                          isActive ? "text-primary/60" : "text-muted-foreground/40"
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
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
              aria-label={`Show testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
