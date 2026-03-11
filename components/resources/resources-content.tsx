"use client";

import Link from "next/link";
import { useState, useRef, useEffect, createElement } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Download,
  Plus,
  Lightbulb,
  Check,
  FileText,
} from "lucide-react";
import { OnePagerModal } from "./one-pager-modal";
import {
  type DocPage,
  type GlossaryTerm,
  glossaryTerms,
  faqItems,
  downloads,
  getTermById,
  getAdjacentTerms,
} from "./resources-data";

interface ResourcesContentProps {
  activePage: DocPage;
  onNavigate: (page: DocPage) => void;
}

export function ResourcesContent({
  activePage,
  onNavigate,
}: ResourcesContentProps) {
  const term = getTermById(activePage);
  const isTermPage = !!term;

  return (
    <main className="flex-1 min-w-0 flex justify-center" id="resources-content">
      <div className="max-w-3xl w-full px-4 lg:px-8 py-16 lg:py-24">
        {activePage === "overview" && <OverviewPage onNavigate={onNavigate} />}
        {activePage === "what-is-midpoint" && <WhatIsMidpointPage />}
        {activePage === "downloads" && <DownloadsPage />}
        {activePage === "faq" && <FaqPage />}
        {isTermPage && term && (
          <GlossaryPage term={term} onNavigate={onNavigate} />
        )}
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Overview Page
   ───────────────────────────────────────────── */
function OverviewPage({ onNavigate }: { onNavigate: (p: DocPage) => void }) {
  return (
    <article>
      {/* Insurance Terms section */}
      <SectionLabel label="Insurance Terms" />
      <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-16 lg:mb-20">
        {glossaryTerms.map((term) => (
          <button
            key={term.id}
            onClick={() => onNavigate(term.id)}
            className="group flex items-start gap-4 rounded-xl border border-border/30 px-5 py-4 md:px-6 md:py-5 text-left hover:border-primary/30 hover:bg-card transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-200">
              {createElement(term.icon, { className: "w-5 h-5" })}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-200 block">
                {term.tab}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground mt-1 block">
                {term.tagline}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 mt-1 group-hover:text-primary/80 flex-shrink-0 transition-colors duration-200" />
          </button>
        ))}
      </div>

      {/* Downloads section */}
      <SectionLabel label="Downloads" />
      <div className="flex flex-col gap-4 mb-16 lg:mb-20">
        {downloads.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 rounded-xl border border-border/30 px-5 py-4 md:px-6 md:py-5"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
            <button className="text-xs md:text-sm font-medium text-primary hover:underline cursor-pointer flex-shrink-0">
              Download PDF
            </button>
          </div>
        ))}
      </div>

      {/* FAQ preview */}
      <SectionLabel label="Frequently Asked" />
      <div className="flex flex-col gap-3">
        {faqItems.slice(0, 3).map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate("faq")}
            className="flex items-center gap-4 rounded-xl border border-border/30 px-5 py-4 text-left hover:border-primary/30 hover:bg-card/50 transition-all duration-200 cursor-pointer"
          >
            <span className="text-sm md:text-base text-foreground/90">{item.question}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 ml-auto flex-shrink-0" />
          </button>
        ))}
        <button
          onClick={() => onNavigate("faq")}
          className="text-xs md:text-sm text-primary font-medium mt-3 self-start hover:underline cursor-pointer"
        >
          View all questions
        </button>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   What is Midpoint? Page
   ───────────────────────────────────────────── */
function WhatIsMidpointPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <article>
      <Breadcrumb items={["Resources", "What is Midpoint?"]} />

      <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground mt-6 mb-4">
        What is Midpoint?
      </h1>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
        Midpoint is an AI-powered platform that helps residential home builders
        and general contractors manage subcontractor insurance compliance. We
        eliminate the paperwork headache by automatically reviewing certificates
        and endorsements to uncover missing coverage, outdated limits, and
        hidden exposures.
      </p>

      {/* Feature items */}
      <div className="space-y-5 mb-10">
        <div className="flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base md:text-lg text-foreground/90">
            <span className="font-medium">Automated COI Analysis</span> — Upload
            certificates and get instant compliance verification
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base md:text-lg text-foreground/90">
            <span className="font-medium">Risk Transfer Gaps</span> — Identify
            missing endorsements before they become claims
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base md:text-lg text-foreground/90">
            <span className="font-medium">Premium Savings</span> — Reduce
            liability premiums with proper documentation
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/30 mb-8" />

      {/* One-pager section */}
      <p className="text-sm md:text-base text-muted-foreground mb-5">
        View our one-pager to learn more about how Midpoint works:
      </p>

      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm md:text-base font-medium hover:opacity-90 transition-opacity cursor-pointer"
      >
        <FileText className="w-5 h-5" />
        Open One Pager
      </button>

      {/* Modal */}
      <OnePagerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </article>
  );
}

/* ─────────────────────────────────────────────
   Glossary Term Page
   ───────────────────────────────────────────── */
function GlossaryPage({
  term,
  onNavigate,
}: {
  term: GlossaryTerm;
  onNavigate: (p: DocPage) => void;
}) {
  const { prev, next } = getAdjacentTerms(term.id);

  return (
    <article className="flex flex-col min-h-[calc(100svh-8rem)]">
      {/* Main content - grows to push nav to bottom */}
      <div className="flex-1">
        {/* Breadcrumb */}
        <Breadcrumb
          items={["Resources", "Insurance Terms", term.tab]}
          onNavigate={onNavigate}
        />

        {/* Title block */}
        <div className="flex items-start gap-4 mt-6 mb-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            {createElement(term.icon, { className: "w-6 h-6 md:w-7 md:h-7" })}
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground">
              {term.title}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              {term.tagline}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/30 mt-8 mb-8" />

        {/* Body text */}
        {term.description && (
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-8">
            {term.description}
          </p>
        )}

        {/* Bullet points */}
        {term.bullets && (
          <ul className="flex flex-col gap-4 mb-8">
            {term.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 mt-2.5">
                  <span className="block w-2 h-2 rounded-full bg-primary" />
                </span>
                <span className="text-base md:text-lg leading-relaxed text-foreground/80">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Insight sections - flush left, no card wrapper */}
        <div className="flex flex-col gap-8 mt-8">
          {term.insights.map((insight, i) => (
            <InsightSection
              key={i}
              title={insight.title}
              content={insight.content}
            />
          ))}
        </div>
      </div>

      {/* Bottom navigation - pushed to bottom */}
      <div className="mt-auto pt-12">
        <div className="h-px bg-border/20 mb-8" />
        <div className="flex items-center justify-between">
          {/* Previous */}
          {prev ? (
            <button
              onClick={() => onNavigate(prev.id)}
              className="group flex items-center gap-4 text-left cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full border border-border/40 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-200">
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground/50 uppercase tracking-[0.15em] block">
                  Previous
                </span>
                <span className="text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                  {prev.tab}
                </span>
              </div>
            </button>
          ) : (
            <div />
          )}

          {/* Next */}
          {next ? (
            <button
              onClick={() => onNavigate(next.id)}
              className="group flex items-center gap-4 text-right cursor-pointer"
            >
              <div>
                <span className="text-xs text-muted-foreground/50 uppercase tracking-[0.15em] block">
                  Next
                </span>
                <span className="text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                  {next.tab}
                </span>
              </div>
              <div className="w-11 h-11 rounded-full border border-border/40 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-200">
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              </div>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   Downloads Page
   ───────────────────────────────────────────── */
function DownloadsPage() {
  return (
    <article>
      <Breadcrumb items={["Resources", "Downloads"]} />

      <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground mt-6 mb-4">
        Helpful Resources
      </h1>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
        Real tools from contractors who transformed their risk management.
        Download these resources to improve your insurance compliance.
      </p>

      <div className="h-px bg-border/30 mb-10" />

      <div className="flex flex-col gap-6">
        {downloads.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border/30 p-6 md:p-8 hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                  {item.description}
                </p>
                <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm md:text-base font-medium hover:opacity-90 transition-opacity cursor-pointer">
                  <Download className="w-4 h-4" />
                  {item.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   FAQ Page
   ───────────────────────────────────────────── */
function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <article>
      <Breadcrumb items={["Resources", "FAQ"]} />

      <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground mt-6 mb-4">
        Common Questions
      </h1>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
        Get clarity on how Midpoint transforms insurance management for
        residential contractors.
      </p>

      <div className="h-px bg-border/30 mb-8" />

      {/* Accordion */}
      <div className="flex flex-col">
        {faqItems.map((item, idx) => (
          <FaqItem
            key={idx}
            item={item}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>

      {/* Contact CTA card */}
      <div className="mt-16 rounded-xl border border-border/30 p-8 md:p-10 text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
          Need more information?
        </h3>
        <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-md mx-auto">
          Our team is ready to answer your specific questions and concerns.
        </p>
        <div className="flex items-center justify-center gap-5 flex-wrap">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-lg text-sm md:text-base font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Contact Us
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm md:text-base text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-xs md:text-sm uppercase tracking-[0.08em] text-muted-foreground/60 flex-shrink-0 font-medium">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/20" />
    </div>
  );
}

function Breadcrumb({
  items,
  onNavigate,
}: {
  items: string[];
  onNavigate?: (p: DocPage) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          {i === 0 && onNavigate ? (
            <button
              onClick={() => onNavigate("overview")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {item}
            </button>
          ) : (
            <span className={i === items.length - 1 ? "text-foreground/80" : ""}>
              {item}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function InsightSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <span className="text-xs md:text-sm uppercase tracking-[0.08em] text-primary font-medium">
          {title}
        </span>
      </div>
      <p className="text-base md:text-lg leading-relaxed text-foreground/70">{content}</p>
    </div>
  );
}

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-border/20">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-base md:text-lg font-medium pr-6 transition-colors duration-200 ${
            isOpen
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        >
          {item.question}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "border-primary bg-primary text-primary-foreground rotate-45"
              : "border-border/50 text-muted-foreground/80 group-hover:border-foreground/50"
          }`}
        >
          <Plus className="w-4 h-4" />
        </div>
      </button>
      <div
        style={{ height, overflow: "hidden" }}
        className="transition-[height] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div ref={contentRef}>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed pb-8 pr-12">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
