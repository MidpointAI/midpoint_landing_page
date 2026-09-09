"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonials } from "./customer-stories-data";
import { TestimonialCard } from "./testimonial-card";
import { SectionIntro } from "./section-intro";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE, delay: i * 0.06 },
  }),
};

export default function CustomerStories() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  // Phones: the track scroll-snaps one card at a time; dots follow the scroll.
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    setPage(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };
  const goTo = (i: number) => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollTo({ left: i * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="w-full bg-background section-y scroll-mt-24">
      <div className="container-site">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          custom={0}
        >
          <SectionIntro
            eyebrow="Customer stories"
            title="Builders who stopped chasing certificates"
            description="Real results from builders who handed trade partner compliance to Midpoint."
          >
            <Button variant="link" asChild>
              <Link href="/customers">
                See all customer stories <ArrowRightIcon />
              </Link>
            </Button>
          </SectionIntro>
        </motion.div>

        {/* Testimonials */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="mt-12 flex md:grid md:grid-cols-3 gap-4 md:gap-px overflow-x-auto md:overflow-hidden snap-x snap-mandatory md:snap-none scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:bg-border md:rounded-xl md:border md:border-border"
        >
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className="flex shrink-0 w-[86%] md:w-auto snap-center"
            >
              <TestimonialCard item={item} className="w-full bg-card p-7 md:p-8 rounded-xl border border-border md:rounded-none md:border-0" />
            </motion.div>
          ))}
        </div>
        <div className="mt-5 flex justify-center gap-2 md:hidden" role="tablist" aria-label="Customer stories">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              role="tab"
              aria-selected={page === i}
              aria-label={`Story ${i + 1} of ${testimonials.length}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${page === i ? "w-5 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
