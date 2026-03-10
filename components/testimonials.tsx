"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  highlights: string[];
  avatarGradient: string;
  panelGlow: string;
};

const testimonials: Testimonial[] = [
  {
    id: "andy-becker",
    name: "Andy Becker",
    title: "CEO",
    company: "Stonegate Homes",
    quote:
      "Before signing on, we didn't have subcontractor agreements in place, and only about 10% of trade partners carried the required insurance. Now every trade partner has an executed agreement and we're sitting at 98% compliance. It's streamlined, accountable, and a big win for our risk management.",
    highlights: ["98% compliance", "Executed agreements"],
    avatarGradient: "linear-gradient(135deg, #A3E635 0%, #34D399 100%)",
    panelGlow:
      "radial-gradient(circle at top left, rgba(163, 230, 53, 0.20), transparent 42%), radial-gradient(circle at 85% 15%, rgba(52, 211, 153, 0.18), transparent 28%), linear-gradient(135deg, rgba(53, 34, 18, 0.92), rgba(96, 54, 22, 0.58))",
  },
  {
    id: "samantha-becher",
    name: "Samantha Becher",
    title: "Office & Finance Manager",
    company: "Starwood Custom Homes",
    quote:
      "Since Midpoint has taken over and streamlined our compliance requirements, it has significantly reduced preparation time and stress during insurance audits and also our day to day tracking. I would definitely recommend this service to any company.",
    highlights: ["Less audit stress", "Faster day-to-day tracking"],
    avatarGradient: "linear-gradient(135deg, #F59E0B 0%, #FB7185 100%)",
    panelGlow:
      "radial-gradient(circle at top left, rgba(245, 158, 11, 0.22), transparent 44%), radial-gradient(circle at 90% 20%, rgba(251, 113, 133, 0.18), transparent 28%), linear-gradient(135deg, rgba(50, 30, 20, 0.92), rgba(110, 52, 26, 0.58))",
  },
  {
    id: "spencer-nield",
    name: "Spencer Nield",
    title: "Director of Operations",
    company: "A Finer Touch Construction",
    quote:
      "Working with Midpoint has been a game-changer for us. Their approach has reduced time spent managing the compliance process as well as dramatically reducing our exposure and insurance premiums.",
    highlights: ["Lower exposure", "Reduced insurance premiums"],
    avatarGradient: "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)",
    panelGlow:
      "radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 42%), radial-gradient(circle at 86% 16%, rgba(129, 140, 248, 0.16), transparent 28%), linear-gradient(135deg, rgba(24, 28, 45, 0.92), rgba(44, 52, 94, 0.52))",
  },
];

const cardPositions = [
  { y: 0, scale: 1, opacity: 1, rotate: 0 },
  { y: -24, scale: 0.965, opacity: 0.44, rotate: 0.75 },
  { y: -48, scale: 0.93, opacity: 0.2, rotate: -0.75 },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const shouldReduceMotion = useReducedMotion();
  const totalTestimonials = testimonials.length;
  const activeTestimonial = testimonials[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + totalTestimonials) % totalTestimonials);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % totalTestimonials);
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-background px-6 py-24 md:py-32"
    >
      <div className="absolute inset-0">
        <div
          className="absolute left-1/2 top-[4%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-3xl transition-all duration-700 md:h-[44rem] md:w-[44rem]"
          style={{ background: activeTestimonial.avatarGradient, opacity: 0.26 }}
        />
        <div className="absolute left-[8%] top-[18%] h-52 w-52 rounded-full bg-primary/16 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-[8%] right-[10%] h-60 w-60 rounded-full bg-sky-400/12 blur-3xl md:h-80 md:w-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,10,14,0.18)_55%,rgba(8,10,14,0.92)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.38em] text-primary/85">
              Testimonials
            </p>
            <h2 className="mt-5 font-display text-4xl leading-none text-foreground md:text-6xl">
              What builders say after{" "}
              <span className="text-primary">Midpoint steps in.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Three customer stories from teams that needed tighter agreements,
              calmer audits, and a lot less compliance drag.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] uppercase tracking-[0.32em] text-white/58 backdrop-blur-xl">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(totalTestimonials).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Show previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/78 transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Show next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/78 transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <div className="relative min-h-[620px] sm:min-h-[560px] md:min-h-[500px]" aria-live="polite">
          {testimonials.map((testimonial, index) => {
            const displayOrder =
              (index - activeIndex + totalTestimonials) % totalTestimonials;
            const position = cardPositions[displayOrder];

            return (
              <motion.article
                key={testimonial.id}
                animate={{
                  y: position.y,
                  scale: position.scale,
                  opacity: position.opacity,
                  rotate: position.rotate,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-x-0 mx-auto w-full max-w-4xl origin-top"
                style={{ zIndex: totalTestimonials - displayOrder }}
                aria-hidden={displayOrder !== 0}
              >
                <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-[24px]">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundImage: testimonial.panelGlow }}
                  />
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                  <div
                    className="absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl"
                    style={{ background: testimonial.avatarGradient, opacity: 0.28 }}
                  />

                  <div className="relative p-6 md:p-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
                          style={{ background: testimonial.avatarGradient }}
                        >
                          {getInitials(testimonial.name)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white md:text-2xl">
                            {testimonial.name}
                          </h3>
                          <p className="mt-1 text-[0.72rem] uppercase tracking-[0.24em] text-primary/85">
                            {testimonial.title}
                          </p>
                          <p className="mt-1 text-sm text-white/52">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/58">
                        <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                        Verified Customer
                      </div>
                    </div>

                    <div className="relative mt-8">
                      <div className="absolute -left-2 -top-10 text-7xl leading-none text-white/10 md:text-8xl">
                        &ldquo;
                      </div>
                      <blockquote className="relative max-w-3xl text-[1.16rem] leading-[1.75] text-white/86 md:text-[1.72rem] md:leading-[1.6]">
                        {testimonial.quote}
                      </blockquote>
                    </div>

                    <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-5 md:flex-row md:items-end md:justify-between">
                      <div className="flex flex-wrap gap-2">
                        {testimonial.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs uppercase tracking-[0.28em] text-white/42">
                        Midpoint Customer Story
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div
          className="flex items-center justify-center gap-1 md:gap-2"
          role="tablist"
          aria-label="Testimonial navigation"
        >
          {testimonials.map((testimonial, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={testimonial.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show testimonial from ${testimonial.name}`}
                onClick={() => setActiveIndex(index)}
                className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-2.5 w-8 bg-primary"
                      : "h-2.5 w-2.5 bg-white/30 hover:bg-white/55"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
