"use client";

import { useState, useRef, useEffect } from "react";
import type { DocPage } from "./docs-sidebar";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  Lightbulb,
  Download,
  Plus,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
  Scale,
  Car,
  HardHat,
  Umbrella,
  UserPlus,
  Bell,
  Copy,
  Check,
  ExternalLink,
  Share2,
} from "lucide-react";
import OnePager from "./one-pager";

/* ─── Glossary data ─── */
const glossaryTerms: Record<
  string,
  {
    tab: string;
    title: string;
    tagline: string;
    description: string;
    bullets?: string[];
    rightTitle: string;
    rightContent: string;
    rightTitle2?: string;
    rightContent2?: string;
    icon: React.ReactNode;
  }
> = {
  "general-liability": {
    tab: "General Liability",
    title: "General Liability Coverage",
    tagline: "Covers damage or injury from sub work",
    description:
      "General Liability covers damage or injury caused by a subcontractor's work -- things like water damage, faulty installation, or someone getting hurt because of their operations.",
    rightTitle: "Why it's required",
    rightContent:
      "If a sub causes damage, you don't want the claim landing on your insurance. GL ensures the sub's policy responds first.",
    rightTitle2: 'Why you want to be "Additional Insured"',
    rightContent2:
      "Being listed as Additional Insured means their policy must defend and cover you if their work triggers a claim. Without it, your insurance could be forced to pay even when the sub is responsible.",
    icon: <Shield className="w-5 h-5" />,
  },
  "waiver-of-subrogation": {
    tab: "Waiver of Subrogation",
    title: "Waiver of Subrogation",
    tagline: "Prevents upstream blame shifting",
    description: "",
    bullets: [
      "It prevents the subcontractor's insurer from coming after the general contractor if a subcontractor causes damage or injury, blocking action that could shift blame upstream.",
      "It aligns with standard risk transfer practices in construction by ensuring the party closest to the work bears the risk and the subcontractor's insurance is fully responsible for losses arising from their operations.",
      "It protects the general contractor's loss history and insurance costs by helping avoid unnecessary claims against the general contractor's policies that could affect future premiums.",
    ],
    rightTitle: "In summary",
    rightContent:
      "A waiver of subrogation is a provision where an insurer agrees that, after covering a loss for its policyholder, it will not seek repayment from any third party that may have contributed to the damage. This provision or endorsement can be applied to many coverages like general liability, workers compensation, and auto liability.",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  "primary-non-contributory": {
    tab: "Primary & Non-Contributory",
    title: "Primary and Non-contributory Insurance",
    tagline: "Defines policy response order",
    description:
      '"Primary and noncontributory" is a contractual insurance requirement that defines how multiple insurance policies must respond to the same loss. When a policy is required to be primary and noncontributory, it means the contractor\'s liability insurance must respond first, before any other applicable policies, and may not seek contribution from other policies that could also be considered primary.',
    rightTitle: "Primary Coverage",
    rightContent:
      "This places full initial responsibility on the contractor's policy for covered losses. In other words, the contractor's liability insurance must respond first before any other applicable policies.",
    rightTitle2: "Noncontributory Requirement",
    rightContent2:
      "The contractor's policy may not seek contribution from other policies that could also be considered primary. This helps ensure other parties' insurance is not tapped for the same covered loss at the outset.",
    icon: <Scale className="w-5 h-5" />,
  },
  "auto-liability": {
    tab: "Auto Liability",
    title: "Auto Liability Coverage",
    tagline: "Vehicle-related accident protection",
    description:
      "Auto Liability covers accidents caused by vehicles a subcontractor uses for work, trucks, vans, trailers, and equipment moved on public roads.",
    rightTitle: "Why it's required",
    rightContent:
      "If a sub's vehicle injures someone or damages property while working on your project, you don't want that liability pushed back to you.",
    rightTitle2: 'Why you want to be "Additional Insured"',
    rightContent2:
      "If a claim involves a vehicle being used for your jobsite or project, being Additional Insured ensures their Auto policy defends you, not yours.",
    icon: <Car className="w-5 h-5" />,
  },
  "workers-comp": {
    tab: "Workers' Compensation",
    title: "Workers' Compensation",
    tagline: "Medical bills and lost wages coverage",
    description:
      "Workers Comp pays medical bills and lost wages when a subcontractor's employee gets hurt while working.",
    rightTitle: "Why it's required",
    rightContent:
      "If a sub doesn't carry Workers Comp, the injured worker can legally pursue you or the property owner for coverage. It protects you from those claims and ensures legal compliance.",
    icon: <HardHat className="w-5 h-5" />,
  },
  "umbrella-coverage": {
    tab: "Umbrella Coverage",
    title: "Umbrella Coverage",
    tagline: "Extra protection above base limits",
    description:
      "Umbrella insurance adds extra protection above a subcontractor's General Liability, Auto, and Workers Comp limits. It's for severe injuries, large fires, or major property damage.",
    rightTitle: "Why it's required",
    rightContent:
      "High-severity losses can exceed basic limits quickly. Umbrella coverage ensures the subcontractor has enough financial protection to handle a catastrophic claim -- instead of the GC getting pulled in.",
    rightTitle2: 'Why you want to be "Additional Insured"',
    rightContent2:
      "Additional Insured status on the sub's Umbrella policy means you're protected even for large or high-dollar claims, keeping your own limits untouched.",
    icon: <Umbrella className="w-5 h-5" />,
  },
  "additional-insured": {
    tab: "Additional Insured",
    title: 'Why "Additional Insured" Matters',
    tagline: "Shift risk to the right policy",
    description:
      "When a subcontractor adds you as an Additional Insured on their liability policies, it ensures:",
    bullets: [
      "Their insurance pays first, not yours",
      "You receive legal defense if you're named in a claim",
      "Your loss history stays clean, keeping your premiums lower",
      "You're protected from lawsuits related to the subcontractor's work",
      "You reduce risk transfer gaps that often cause claim disputes",
    ],
    rightTitle: "In summary",
    rightContent:
      "Additional Insured status is what allows you to shift the risk of a subcontractor's work to their insurance -- where it belongs.",
    icon: <UserPlus className="w-5 h-5" />,
  },
  "notice-of-cancellation": {
    tab: "30-Day Notice",
    title: "Notice of Cancellation",
    tagline: "Early warning for coverage lapses",
    description:
      "A notice of cancellation is a formal alert from an insurance company stating that a subcontractor's policy will end on a certain date. The insurer must send this notice before the cancellation becomes effective, giving you time to address the issue.",
    rightTitle: "Why It Matters for General Contractors",
    rightContent:
      "This notice is important because it tells you that a sub's insurance coverage is about to lapse or be terminated. That could be due to missed premium payments, underwriting issues, or other changes in the risk. Once the policy is canceled, the subcontractor no longer carries the protection your contract requires, and any losses that occur afterward may fall back on you or your own insurance.",
    rightTitle2: "How to Use It in Subcontract Agreements",
    rightContent2:
      "Requiring notice of cancellation ensures you are informed early, so you can pause work, request proof of reinstatement, or take other steps to protect the project and your own liability.",
    icon: <Bell className="w-5 h-5" />,
  },
};

const glossaryIds = Object.keys(glossaryTerms);

/* ─── FAQ data ─── */
const faqItems = [
  {
    question: "How does Midpoint work?",
    answer:
      "Our team working with advanced tools analyze complex insurance policies. We scan documents instantly, identifying hidden risks and optimization opportunities. The result is a comprehensive risk management strategy tailored to protect you.",
  },
  {
    question: "Can I save money?",
    answer:
      "Absolutely. Midpoint's intelligent system uncovers potential premium reductions by analyzing your current insurance coverage. We provide detailed recommendations that can significantly lower your financial burden.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is a top priority. We use bank-grade encryption and follow strict data protection protocols. Your sensitive information remains confidential and protected throughout our analysis process.",
  },
  {
    question: "Who can use Midpoint?",
    answer:
      "Midpoint is designed specifically for residential home builders, general contractors, and subcontractors. Whether you're a small business or a large construction firm, our platform adapts to your unique insurance needs.",
  },
  {
    question: "How quickly can I start?",
    answer:
      "Getting started is simple and fast. Our onboarding process takes minutes, not days. You'll have actionable insights into your insurance strategy within hours of initial setup.",
  },
];

/* ─── Resources data ─── */
const resources = [
  {
    title: "Risk Transfer Checklist",
    description: "Helpful checklist to show what true compliance takes.",
    cta: "Download PDF",
  },
  {
    title: "Understanding Midpoint",
    description:
      "A quick explanation of how Midpoint works and can save builders time and money.",
    cta: "Download PDF",
  },
];

/* ════════════════════════════════════════════
   Main export
   ════════════════════════════════════════════ */
export function DocsContent({
  activePage,
  onNavigate,
}: {
  activePage: DocPage;
  onNavigate: (page: DocPage) => void;
}) {
  const isGlossaryPage = !!glossaryTerms[activePage];
  const isWhatIsMidpoint = activePage === "what-is-midpoint";

  return (
    <main className="flex-1 overflow-y-auto flex flex-col">
      {isWhatIsMidpoint ? (
        <div className="px-6 lg:px-10 py-10 lg:py-14 w-full">
          <WhatIsMidpointPage />
        </div>
      ) : (
        <div className={`max-w-3xl mx-auto px-6 lg:px-10 py-10 lg:py-14 w-full ${isGlossaryPage ? "flex-1 flex flex-col" : ""}`}>
          {activePage === "overview" && <OverviewPage onNavigate={onNavigate} />}
          {activePage === "resources" && <ResourcesPage />}
          {activePage === "faq" && <FaqPage />}
          {glossaryTerms[activePage] && (
            <GlossaryPage
              termId={activePage}
              term={glossaryTerms[activePage]}
              onNavigate={onNavigate}
            />
          )}
        </div>
      )}
    </main>
  );
}

/* ─── Overview page ─── */
function OverviewPage({ onNavigate }: { onNavigate: (p: DocPage) => void }) {
  return (
    <article>
      <Breadcrumb items={["Resources"]} />
      <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground mt-4 mb-3 text-balance">
        Risk Management Resources
      </h1>
      <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-10 max-w-xl">
        Essential tools and insights to help builders navigate complex insurance
        landscapes and optimize risk transfer strategies.
      </p>
      <div className="h-px bg-border/50 mb-10" />

      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">
        Insurance Terms
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        {glossaryIds.map((id) => {
          const t = glossaryTerms[id];
          return (
            <button
              key={id}
              onClick={() => onNavigate(id as DocPage)}
              className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-4 text-left hover:border-primary/30 hover:bg-card transition-all duration-200 cursor-pointer"
            >
              <div className="mt-0.5 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-200">
                {t.icon}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 block">
                  {t.tab}
                </span>
                <span className="text-xs text-muted-foreground/60 mt-0.5 block truncate">
                  {t.tagline}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 ml-auto mt-1 group-hover:text-primary/60 flex-shrink-0 transition-colors duration-200" />
            </button>
          );
        })}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">
        Downloads
      </h2>
      <div className="flex flex-col gap-3 mb-12">
        {resources.map((r) => (
          <div
            key={r.title}
            className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 hover:border-primary/30 hover:bg-card transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Download className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">
                {r.description}
              </p>
            </div>
            <button className="text-xs font-medium text-primary hover:underline cursor-pointer flex-shrink-0">
              {r.cta}
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">
        Frequently Asked
      </h2>
      <div className="flex flex-col gap-2">
        {faqItems.slice(0, 3).map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate("faq")}
            className="flex items-center gap-3 rounded-lg border border-border/40 px-4 py-3 text-left hover:border-primary/30 hover:bg-card/50 transition-all duration-200 cursor-pointer"
          >
            <span className="text-sm text-foreground/80">{item.question}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto flex-shrink-0" />
          </button>
        ))}
        <button
          onClick={() => onNavigate("faq")}
          className="text-xs text-primary font-medium mt-2 self-start hover:underline cursor-pointer"
        >
          View all questions
        </button>
      </div>
    </article>
  );
}

/* ─── Glossary term page ─── */
function GlossaryPage({
  termId,
  term,
  onNavigate,
}: {
  termId: string;
  term: (typeof glossaryTerms)[string];
  onNavigate: (p: DocPage) => void;
}) {
  const currentIdx = glossaryIds.indexOf(termId);
  const prevTerm =
    currentIdx > 0 ? glossaryTerms[glossaryIds[currentIdx - 1]] : null;
  const nextTerm =
    currentIdx < glossaryIds.length - 1
      ? glossaryTerms[glossaryIds[currentIdx + 1]]
      : null;

  return (
    <article className="flex-1 flex flex-col">
      {/* Main content */}
      <div className="flex-1">
        <Breadcrumb items={["Resources", "Insurance Terms", term.tab]} />
        <div className="flex items-start gap-4 mt-4 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            {term.icon}
          </div>
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-wide text-foreground text-balance">
              {term.title}
            </h1>
            <p className="text-sm text-primary/70 mt-1">{term.tagline}</p>
          </div>
        </div>
        <div className="h-px bg-border/50 my-8" />

        {term.description && (
          <p className="text-foreground/80 text-base leading-relaxed mb-6">
            {term.description}
          </p>
        )}
        {term.bullets && (
          <ul className="flex flex-col gap-3 mb-8">
            {term.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 mt-2.5">
                  <span className="block w-1.5 h-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-foreground/80 text-base leading-relaxed">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-4 mt-8">
          <InsightCard
            icon={<Lightbulb className="w-4 h-4" />}
            title={term.rightTitle}
            content={term.rightContent}
          />
          {term.rightTitle2 && term.rightContent2 && (
            <InsightCard
              icon={<Shield className="w-4 h-4" />}
              title={term.rightTitle2}
              content={term.rightContent2}
            />
          )}
        </div>
      </div>

      {/* Prev/Next Navigation - fixed at bottom */}
      <div className="sticky bottom-0 bg-background pt-4 pb-2 mt-8 border-t border-border/30">
        <div className="flex items-center justify-between">
        {prevTerm ? (
          <button
            onClick={() => onNavigate(glossaryIds[currentIdx - 1] as DocPage)}
            className="group flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-200">
              <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest block">
                Previous
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {prevTerm.tab}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}
        {nextTerm ? (
          <button
            onClick={() => onNavigate(glossaryIds[currentIdx + 1] as DocPage)}
            className="group flex items-center gap-3 text-right cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest block">
                Next
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {nextTerm.tab}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-200">
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
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

/* ─── Resources page ─── */
function ResourcesPage() {
  return (
    <article>
      <Breadcrumb items={["Resources", "Downloads"]} />
      <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground mt-4 mb-3 text-balance">
        Helpful Resources
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-xl">
        Real tools from contractors who transformed their risk management.
      </p>
      <div className="h-px bg-border/50 mb-10" />
      <div className="flex flex-col gap-5">
        {resources.map((r) => (
          <div
            key={r.title}
            className="rounded-xl border border-border/50 bg-card/50 p-6 lg:p-8 hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {r.description}
                </p>
                <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                  {r.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

/* ─── FAQ page ─── */
function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <article>
      <Breadcrumb items={["Resources", "FAQ"]} />
      <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground mt-4 mb-3 text-balance">
        Common Questions
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-xl">
        Get clarity on how Midpoint transforms insurance management for
        residential contractors.
      </p>
      <div className="h-px bg-border/50 mb-8" />
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

      <div className="mt-14 rounded-xl border border-border/50 bg-card/50 p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Need more information?
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Our team is ready to answer your specific questions and concerns.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Contact Us
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Learn More
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

/* ─── What is Midpoint page ─── */
function WhatIsMidpointPage() {
  const [copied, setCopied] = useState(false);
  const previewScale = 0.9;
  const previewWidth = Math.round(612 * previewScale);
  const previewHeight = Math.round(916 * previewScale);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/one-pager`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/one-pager`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "What is Midpoint?",
          text: "Learn how Midpoint helps builders manage insurance compliance.",
          url: url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <article className="mx-auto w-full max-w-[1320px]">
      <Breadcrumb items={["Resources", "What is Midpoint?"]} />

      <div className="grid xl:grid-cols-[minmax(0,1fr)_auto] gap-10 xl:gap-12 items-start">
        {/* Left column - Text content */}
        <div className="flex flex-col">
          <div className="max-w-[63ch]">
            <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
              What is Midpoint?
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              Midpoint is an AI-powered platform that helps residential home builders
              and general contractors manage subcontractor insurance compliance. We
              eliminate the paperwork headache by automatically reviewing certificates
              and endorsements to uncover missing coverage, outdated limits, and hidden
              exposures.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground/80">
                  <span className="font-medium">Automated COI Analysis</span> — Upload certificates and get instant compliance verification
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground/80">
                  <span className="font-medium">Risk Transfer Gaps</span> — Identify missing endorsements before they become claims
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground/80">
                  <span className="font-medium">Premium Savings</span> — Reduce liability premiums with proper documentation
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[63ch] mt-10 xl:mt-12">
            <div className="h-px bg-border/50 mb-6" />

            <p className="text-sm text-muted-foreground mb-4">
              Share this one-pager with your team or partners:
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-secondary/50 text-sm font-medium text-foreground hover:border-primary/30 hover:bg-secondary transition-all duration-200 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-primary" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-secondary/50 text-sm font-medium text-foreground hover:border-primary/30 hover:bg-secondary transition-all duration-200 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              <a
                href="/one-pager"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Open Full Size
              </a>
            </div>
          </div>
        </div>

        {/* Right column - One-pager preview */}
        <div className="xl:sticky xl:top-6 flex xl:justify-end">
          <div style={{ width: `${previewWidth}px` }}>
            <div
              className="overflow-hidden rounded-xl border border-border/40 shadow-[0_28px_90px_rgba(0,0,0,0.52)]"
              style={{
                width: `${previewWidth}px`,
                height: `${previewHeight}px`,
              }}
            >
              <div
                style={{
                  width: "612px",
                  height: "916px",
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                <OnePager embedded />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Shared sub-components ─── */
function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3 h-3" />}
          <span className={i === items.length - 1 ? "text-foreground/80" : ""}>
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

function InsightCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/30 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          {title}
        </p>
      </div>
      <p className="text-foreground/70 text-sm leading-relaxed">{content}</p>
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
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-border/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm font-medium pr-4 transition-colors duration-200 ${
            isOpen
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        >
          {item.question}
        </span>
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "border-primary bg-primary text-primary-foreground rotate-45"
              : "border-border/50 text-muted-foreground/60 group-hover:border-foreground/30"
          }`}
        >
          <Plus className="w-3 h-3" />
        </div>
      </button>
      <div
        style={{ height, overflow: "hidden" }}
        className="transition-[height] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div ref={contentRef}>
          <p className="text-muted-foreground text-sm leading-relaxed pb-6 pr-10">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
