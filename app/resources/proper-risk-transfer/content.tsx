"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  FileText,
  Check,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  Download,
  Share2,
  LinkIcon,
} from "lucide-react";

export function ProperRiskTransferContent() {
  const [copied, setCopied] = useState(false);

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
    <div className="min-h-svh bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Link>
          </div>

          <div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground">
                  Proper Risk Transfer
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mt-2">
                  How it works — step by step
                </p>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <a
                href="/proper-risk-transfer.pdf"
                download="Proper Risk Transfer – Midpoint.pdf"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
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

            {/* Intro callout */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 md:p-6 mt-8 mb-10">
              <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                Proper risk transfer ensures that when a subcontractor causes
                damage or injury,{" "}
                <span className="font-semibold text-foreground">
                  their insurance responds — not yours
                </span>
                . It requires three documents working together: the sub-contract,
                the COI, and the actual endorsements. If any link breaks, the risk
                flows back to the GC.
              </p>
            </div>

          <div className="h-px bg-border/30 mb-10" />

          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-8">
            The Risk Transfer Flow
          </p>

          {/* Step 1 */}
          <StandaloneStep
            number={1}
            badge="Master Sub-Contract Agreement"
            title="Set the Insurance Requirements in Writing"
            description="Before any work begins, the sub-contract must define exact coverage the subcontractor is required to carry. Everything else is verified against it."
            cards={[
              {
                title: "Required Coverage Types",
                content:
                  "Commercial GL · Auto Liability · Workers' Comp · Employers Liability · Excess/Umbrella",
              },
              {
                title: "Required Contract Language",
                content:
                  "GC named as Additional Insured · Primary & Non-Contributory · Waiver of Subrogation",
              },
            ]}
          />

          {/* Step 2 */}
          <StandaloneStep
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
          <StandaloneStep
            number={3}
            badge="Additional Insured Endorsements"
            title="Obtain the Actual Endorsements — Not Just the Checkbox"
            description="This is where most risk transfer fails. Without the endorsement attached to the policy, Additional Insured status is unenforceable at claim time."
            cards={[
              {
                title: "Ongoing Operations (CG 20 10)",
                content:
                  "Covers claims from the sub's work while actively on the job site. Required from day one.",
              },
              {
                title: "Completed Operations (CG 20 37)",
                content:
                  "Covers claims after work is finished. Required for years post-completion. Frequently missed.",
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
              The COI and endorsements only tell part of the story. Exclusions
              and GL rating pages reveal hidden gaps that won&apos;t appear
              anywhere else — and could leave your client fully exposed at claim
              time.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border/30 bg-background/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">
                    Why Exclusions Matter
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A sub&apos;s policy may exclude the exact type of work being
                  performed. None of this appears on the COI.
                </p>
              </div>
              <div className="rounded-lg border border-border/30 bg-background/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">
                    Why GL Rating Pages Matter
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If the sub&apos;s actual scope isn&apos;t listed, the insurer
                  may deny the claim even if the policy appears active.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <StandaloneCheckItem text="Request exclusions directly from the sub's broker — not just the COI" />
              <StandaloneCheckItem text="Confirm the GL policy is rated for the sub's actual scope on this project" />
              <StandaloneCheckItem text="Flag any gaps to your client before work begins — not after a claim" />
            </div>
          </div>

          {/* Step 4 */}
          <StandaloneStep
            number={4}
            badge="Ongoing Monitoring"
            title="Track Every Policy Through Project Completion"
            description="Compliance must be maintained continuously. Policies expire, subs change insurers, and projects run long."
            cards={[
              {
                title: "Proactive Renewal Outreach",
                content:
                  "Request updated COIs and endorsements 30 days before any policy expiration.",
              },
              {
                title: "Completed Ops Duration",
                content:
                  "Confirm the sub maintains completed operations AI for the full contract period — typically 2–5 years post-completion.",
              },
            ]}
          />

          {/* Step 5 - Success */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs uppercase tracking-[0.12em] font-semibold text-primary block">
                Step 5 — Risk Successfully Transferred
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              The GC Is Protected — Coverage Responds Correctly
            </h3>
            <p className="text-base text-foreground/70 leading-relaxed">
              When all documents are in place, verified, and current — the
              subcontractor&apos;s policy responds first. The GC&apos;s policy
              is protected and claims are handled by the party responsible for
              the work.
            </p>
          </div>

          </div>

          {/* Back to resources */}
          <div className="mt-16 pt-8 border-t border-border/20 text-center">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all resources
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StandaloneStep({
  number,
  badge,
  title,
  description,
  cards,
  checks,
  warnings,
  callout,
}: {
  number: number;
  badge: string;
  title: string;
  description: string;
  cards?: { title: string; content: string }[];
  checks?: string[];
  warnings?: string[];
  callout?: string;
}) {
  return (
    <div className="mb-10">
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

        {(checks || warnings) && (
          <div className={`grid ${warnings ? "sm:grid-cols-2" : ""} gap-4`}>
            {checks && (
              <div className="space-y-2">
                {checks.map((item) => (
                  <StandaloneCheckItem key={item} text={item} />
                ))}
              </div>
            )}
            {warnings && (
              <div className="space-y-2">
                {warnings.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {callout && (
          <div className="rounded-lg border border-border/30 bg-card/50 p-5 mt-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <span className="font-medium">&cularr;</span> {callout}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StandaloneCheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
      <span className="text-sm text-foreground/80">{text}</span>
    </div>
  );
}
