"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, createElement } from "react";
import { useTheme } from "next-themes";
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
  ShieldCheck,
  AlertTriangle,
  Eye,
  RefreshCw,
  CheckCircle2,
  Share2,
  LinkIcon,
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
        {activePage === "proper-risk-transfer" && <ProperRiskTransferPage />}
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
      {/* Proper Risk Transfer highlight */}
      <SectionLabel label="Guide" />
      <button
        onClick={() => onNavigate("proper-risk-transfer")}
        className="group w-full flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 md:px-6 md:py-5 text-left hover:border-primary/40 hover:bg-primary/10 transition-all duration-200 cursor-pointer mb-16 lg:mb-20"
      >
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary/20 transition-colors duration-200">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-200 block">
            Proper Risk Transfer
          </span>
          <span className="text-xs md:text-sm text-muted-foreground mt-1 block">
            Step-by-step guide to ensure subcontractor insurance responds correctly
          </span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-primary/50 mt-1 group-hover:text-primary flex-shrink-0 transition-colors duration-200" />
      </button>

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
   Proper Risk Transfer Page
   ───────────────────────────────────────────── */
function ProperRiskTransferPage() {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleDownloadPDF = () => {
    const href =
      resolvedTheme === "dark"
        ? "/proper-risk-transfer-dark.pdf"
        : "/proper-risk-transfer-light.pdf";
    const a = document.createElement("a");
    a.href = href;
    a.download = "Proper Risk Transfer – Midpoint.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/resources/proper-risk-transfer`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/resources/proper-risk-transfer`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Proper Risk Transfer — Midpoint",
          text: "Step-by-step guide to ensure subcontractor insurance responds correctly.",
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <article>
      <Breadcrumb items={["Resources", "Proper Risk Transfer"]} />

      <div className="flex items-start gap-4 mt-6 mb-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
          <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground">
            Proper Risk Transfer
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            How it works — step by step
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3 mt-6 mb-8 flex-wrap">
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border/40 text-foreground/80 hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border/40 text-foreground/80 hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-primary" />
              <span className="text-primary">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* Intro */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 md:p-6 mt-8 mb-10">
        <p className="text-base md:text-lg leading-relaxed text-foreground/90">
          Proper risk transfer ensures that when a subcontractor causes damage or
          injury, <span className="font-semibold text-foreground">their insurance responds — not yours</span>. It requires three
          documents working together: the sub-contract, the COI, and the actual
          endorsements. If any link breaks, the risk flows back to the GC.
        </p>
      </div>

      <div className="h-px bg-border/30 mb-10" />

      {/* THE RISK TRANSFER FLOW */}
      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-8">
        The Risk Transfer Flow
      </p>

      {/* Step 1 */}
      <RiskTransferStep
        number={1}
        badge="Master Sub-Contract Agreement"
        title="Set the Insurance Requirements in Writing"
        description="Before any work begins, the sub-contract must define exact coverage the subcontractor is required to carry. Everything else is verified against it."
        cards={[
          {
            title: "Required Coverage Types",
            content: "Commercial GL · Auto Liability · Workers' Comp · Employers Liability · Excess/Umbrella",
          },
          {
            title: "Required Contract Language",
            content: "GC named as Additional Insured · Primary & Non-Contributory · Waiver of Subrogation",
          },
        ]}
      />

      {/* Step 2 */}
      <RiskTransferStep
        number={2}
        badge="Certificate of Insurance (COI)"
        title="Collect & Verify the Certificate"
        description="The COI is proof of insurance — but it is not the policy and does not guarantee coverage. Every field must be checked against contract requirements."
        checks={[
          "Policy active — dates current",
          "Limits meet contract minimums",
          "GC named as Certificate Holder",
          "Additional Insured box checked",
          "Cancellation notice clause present",
        ]}
        warnings={[
          "COI alone does not create AI status",
          "Checked box ≠ endorsement on file",
          "Wrong named insured = no coverage",
          "Expired policy mid-project = gap",
        ]}
        callout="COI must loop back to the Sub Agreement. Every coverage type, limit, and named insured on the COI must match exactly what the contract requires. Any mismatch means the sub is out of compliance."
      />

      {/* Step 3 */}
      <RiskTransferStep
        number={3}
        badge="Additional Insured Endorsements"
        title="Obtain the Actual Endorsements — Not Just the Checkbox"
        description="This is where most risk transfer fails. Without the endorsement attached to the policy, Additional Insured status is unenforceable at claim time."
        cards={[
          {
            title: "Ongoing Operations (CG 20 10)",
            content: "Covers claims from the sub's work while actively on the job site. Required from day one.",
          },
          {
            title: "Completed Operations (CG 20 37)",
            content: "Covers claims after work is finished. Required for years post-completion. Frequently missed.",
          },
        ]}
        checks={[
          "Endorsement must state Primary & Non-Contributory — not just the COI",
          "Waiver of Subrogation must appear in the endorsement wording",
        ]}
        callout="Endorsements loop back to the Sub Agreement. The endorsement language must satisfy the exact terms written in the contract. If P&NC is required and the endorsement doesn't reflect it, risk transfer is incomplete."
      />

      {/* Critical Section */}
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6 md:p-8 my-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          </div>
          <span className="text-xs uppercase tracking-[0.12em] font-semibold text-yellow-500">
            Critical — Often Overlooked
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
          Request Exclusions List & GL Rating Pages
        </h3>
        <p className="text-base text-foreground/70 leading-relaxed mb-6">
          The COI and endorsements only tell part of the story. Exclusions and GL
          rating pages reveal hidden gaps that won&apos;t appear anywhere else — and
          could leave your client fully exposed at claim time.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border/30 bg-background/50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Why Exclusions Matter</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A sub&apos;s policy may exclude the exact type of work being performed.
              None of this appears on the COI.
            </p>
          </div>
          <div className="rounded-lg border border-border/30 bg-background/50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Why GL Rating Pages Matter</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If the sub&apos;s actual scope isn&apos;t listed, the insurer may deny the
              claim even if the policy appears active.
            </p>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <CheckItem text="Request exclusions directly from the sub's broker — not just the COI" />
          <CheckItem text="Confirm the GL policy is rated for the sub's actual scope on this project" />
          <CheckItem text="Flag any gaps to your client before work begins — not after a claim" />
        </div>
      </div>

      {/* Step 4 */}
      <RiskTransferStep
        number={4}
        badge="Ongoing Monitoring"
        title="Track Every Policy Through Project Completion"
        description="Compliance must be maintained continuously. Policies expire, subs change insurers, and projects run long."
        cards={[
          {
            title: "Proactive Renewal Outreach",
            content: "Request updated COIs and endorsements 30 days before any policy expiration.",
          },
          {
            title: "Completed Ops Duration",
            content: "Confirm the sub maintains completed operations AI for the full contract period — typically 2–5 years post-completion.",
          },
        ]}
        icon={<RefreshCw className="w-5 h-5" />}
      />

      {/* Step 5 - Success */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 mt-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.12em] font-semibold text-primary block">
              Step 5 — Risk Successfully Transferred
            </span>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
          The GC Is Protected — Coverage Responds Correctly
        </h3>
        <p className="text-base text-foreground/70 leading-relaxed">
          When all documents are in place, verified, and current — the
          subcontractor&apos;s policy responds first. The GC&apos;s policy is protected and
          claims are handled by the party responsible for the work.
        </p>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   Risk Transfer Sub-components
   ───────────────────────────────────────────── */
function RiskTransferStep({
  number,
  badge,
  title,
  description,
  cards,
  checks,
  warnings,
  callout,
  icon,
}: {
  number: number;
  badge: string;
  title: string;
  description: string;
  cards?: { title: string; content: string }[];
  checks?: string[];
  warnings?: string[];
  callout?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      {/* Step header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
          {number}
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.12em] text-primary font-semibold block mb-1">
            {badge}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
        </div>
      </div>

      <p className="text-base md:text-lg text-foreground/70 leading-relaxed ml-14 mb-5">
        {description}
      </p>

      <div className="ml-14 space-y-4">
        {/* Two-column cards */}
        {cards && (
          <div className="grid sm:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-border/30 p-5"
              >
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {card.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Checks and warnings side by side */}
        {(checks || warnings) && (
          <div className={`grid ${warnings ? "sm:grid-cols-2" : ""} gap-4`}>
            {checks && (
              <div className="space-y-2">
                {checks.map((item) => (
                  <CheckItem key={item} text={item} />
                ))}
              </div>
            )}
            {warnings && (
              <div className="space-y-2">
                {warnings.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Callout */}
        {callout && (
          <div className="rounded-lg border border-border/30 bg-card/50 p-5 mt-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <span className="font-medium">↩</span>{" "}
              {callout}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
      <span className="text-sm text-foreground/80">{text}</span>
    </div>
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
