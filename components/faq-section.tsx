"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How does Midpoint work?",
    answer:
      "Midpoint connects to your systems or works standalone. Our AI analyzes every certificate, endorsement, and policy document, automatically detecting coverage gaps and tracking expirations.",
  },
  {
    question: "Can Midpoint save me money?",
    answer:
      "Clients typically see $50,000 to $200,000+ in annual savings through reduced premiums, eliminated coverage gaps, and time savings. Most see ROI within the first month.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We use bank-level AES-256 encryption, SOC 2 Type II certified infrastructure, and strict access controls. Your documents are never shared with third parties.",
  },
  {
    question: "Who can use Midpoint?",
    answer:
      "General contractors, construction managers, and builders of all sizes. Whether you manage 10 subcontractors or 1,000, we scale to your needs.",
  },
  {
    question: "How quickly can I start?",
    answer:
      "Under 15 minutes. Create your account, invite subcontractors or upload certificates, and our AI starts analyzing immediately.",
  },
];

function FaqItemComponent({
  faq,
  index,
  isOpen,
  onToggle,
  isInView,
}: {
  faq: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isInView: boolean;
}) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className={`
        group relative overflow-hidden
        bg-[#0a0a0a] border border-[#1a1a1a]
        transition-all duration-300 ease-out
        ${isOpen ? "border-[#C9FF64]/30" : "hover:border-[#2a2a2a]"}
      `}
    >
      {/* Accent line indicator */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-[2px]
          transition-all duration-300
          ${isOpen ? "bg-[#C9FF64]" : "bg-transparent group-hover:bg-[#2a2a2a]"}
        `}
      />

      <button
        onClick={onToggle}
        className="w-full px-6 md:px-8 py-6 md:py-7 flex items-center gap-4 md:gap-6 text-left"
      >
        {/* Number */}
        <span
          className={`
            font-mono text-sm tracking-wider
            transition-colors duration-300
            ${isOpen ? "text-[#C9FF64]" : "text-[#444444] group-hover:text-[#666666]"}
          `}
        >
          {formattedIndex}
        </span>

        {/* Question */}
        <span
          className={`
            flex-1 text-lg md:text-xl font-normal tracking-tight
            transition-colors duration-300
            ${isOpen ? "text-white" : "text-[#cccccc] group-hover:text-white"}
          `}
        >
          {faq.question}
        </span>

        {/* Chevron icon */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            flex-shrink-0 w-8 h-8 flex items-center justify-center
            rounded-full border transition-all duration-300
            ${
              isOpen
                ? "border-[#C9FF64]/40 text-[#C9FF64]"
                : "border-[#333333] text-[#555555] group-hover:border-[#444444] group-hover:text-[#888888]"
            }
          `}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      {/* Answer with AnimatePresence */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-6 md:pb-7 pl-[4.5rem] md:pl-[5.5rem]">
              <p className="text-[#999999] leading-relaxed text-base max-w-2xl">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="bg-[#050505] py-24 md:py-32 lg:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Two-column header layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 md:mb-20">
          {/* Left column - Title */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.4em] uppercase text-[#C9FF64] mb-6 block font-mono"
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white tracking-tight leading-[1.1]"
            >
              Questions &<br />
              <span className="text-[#888888]">Answers</span>
            </motion.h2>
          </div>

          {/* Right column - Description */}
          <div className="flex items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#666666] text-lg leading-relaxed max-w-md"
            >
              Everything you need to know about Midpoint. Can&apos;t find what
              you&apos;re looking for? Reach out to our team.
            </motion.p>
          </div>
        </div>

        {/* FAQ Items with spacing */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FaqItemComponent
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 md:mt-16 pt-12 border-t border-[#1a1a1a]"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[#555555] text-sm">
              Still have questions?
            </p>
            <a
              href="#contact"
              className="
                group inline-flex items-center gap-2
                text-sm text-white font-medium
                transition-colors duration-300
                hover:text-[#C9FF64]
              "
            >
              <span>Contact our team</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
