"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { testimonials, type Testimonial } from "./customer-stories-data";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE, delay: i * 0.06 },
  }),
};

/** Company logo if the file exists; otherwise the name in the eyebrow style. */
function CompanyMark({ item }: { item: Testimonial }) {
  const [failed, setFailed] = useState(false);
  if (item.logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.logo}
        alt={item.company}
        className="h-6 w-auto max-w-[140px] object-contain opacity-80"
        onError={() => setFailed(true)}
      />
    );
  }
  return <span className="eyebrow">{item.company}</span>;
}

export default function CustomerStories() {
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
          className="max-w-2xl"
        >
          <p className="eyebrow mb-4">Customer stories</p>
          <h2 className="heading-2 text-foreground mb-4">
            Builders who stopped chasing certificates
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Real results from builders who handed trade partner compliance to Midpoint.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {testimonials.map((item, i) => (
            <motion.figure
              key={item.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className="rounded-xl border border-border bg-card p-7 md:p-8 flex flex-col"
            >
              <div className="flex items-center justify-between gap-4 mb-6 min-h-6">
                <CompanyMark item={item} />
                {item.highlight ? (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary whitespace-nowrap">
                    {item.highlight}
                  </span>
                ) : null}
              </div>
              <blockquote className="text-base text-foreground/90 leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

      </div>
    </section>
  );
}
