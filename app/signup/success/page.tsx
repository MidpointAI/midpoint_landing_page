"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Pencil,
} from "lucide-react";

interface SessionData {
  status: string;
  payment_status: string;
  customer_email: string;
  amount_total: number;
  currency: string;
  metadata: {
    customerName: string;
    companyName: string;
    activeSubs: string;
    activeProjects: string;
    tierName: string;
    annualPrice: string;
  };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch(
          `/api/checkout-session?session_id=${sessionId}`
        );
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setSessionData(data);
        }
      } catch {
        setError("Failed to fetch payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-white/60">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-white/60 mb-6">{error || "Unable to load payment details"}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const { metadata, amount_total, payment_status } = sessionData;
  const tierSubtitle =
    parseInt(metadata.activeSubs) > 75
      ? "100+ SUBS"
      : parseInt(metadata.activeSubs) > 25
      ? "25-75 TRADES/SUBS"
      : "UP TO 25 ACTIVE SUBS";

  const isPaymentSuccessful = payment_status === "paid";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="text-white font-semibold text-lg">
            Midpoint
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isPaymentSuccessful ? "Payment Successful!" : "Payment Processing"}
          </h1>
          <p className="text-white/60">
            {isPaymentSuccessful
              ? "Thank you for your purchase. Your subscription is now active."
              : "Your payment is being processed. We'll notify you once it's complete."}
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-[#f4ffe0] rounded-2xl overflow-hidden">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-1 px-6 py-4 bg-[#f4ffe0]/95">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium bg-[#22251e] text-[#f4ffe0]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Purchase Complete
            </span>
          </div>

          <div className="px-8 lg:px-12 pt-6 pb-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left column - Summary label */}
              <div className="lg:w-[180px] flex-shrink-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#22251e]/40 font-mono">
                  SUMMARY &rarr;
                </p>
              </div>

              {/* Right column - Content */}
              <div className="flex-1 flex flex-col lg:flex-row gap-6">
                {/* Business Details Card */}
                <div className="flex-1 rounded-xl border border-[#22251e]/8 bg-white p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[14px] font-semibold text-[#22251e]">
                      Your Business Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#22251e]/40 mb-1">
                        BUSINESS NAME
                      </p>
                      <p className="text-[14px] font-medium text-[#22251e]">
                        {metadata.companyName || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#22251e]/40 mb-1">
                        PRIMARY CONTACT
                      </p>
                      <p className="text-[14px] font-medium text-[#22251e]">
                        {metadata.customerName}
                      </p>
                      <p className="text-[13px] text-[#22251e]/60">
                        Email: {sessionData.customer_email}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#22251e]/40 mb-1">
                        Your Compliance Profile
                      </p>
                      <div className="flex gap-6 mt-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#22251e]/40">
                            ACTIVE SUBS
                          </p>
                          <p className="text-[16px] font-semibold text-[#22251e]">
                            {metadata.activeSubs}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#22251e]/40">
                            ACTIVE PROJECTS
                          </p>
                          <p className="text-[16px] font-semibold text-[#22251e]">
                            {metadata.activeProjects}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#22251e]/8 my-6" />

                  {/* Your Plan */}
                  <div>
                    <h4 className="text-[13px] text-[#22251e]/60 mb-4">
                      Your plan
                    </h4>

                    <h3 className="text-[18px] font-semibold text-[#22251e]">
                      {metadata.tierName}
                    </h3>
                    <p className="text-[11px] uppercase tracking-wider text-[#22251e]/40 mb-2">
                      {tierSubtitle}
                    </p>
                    <p className="text-[13px] text-[#22251e]/50 italic mb-4">
                      Based on your sub count and project volume,{" "}
                      {metadata.tierName} is the right fit.
                    </p>

                    <div className="h-px bg-[#22251e]/8 my-4" />

                    <p className="text-[13px] text-[#22251e]/60">
                      Billed: Yearly
                    </p>
                    <p className="text-[12px] text-[#22251e]/40">
                      Midpoint risk transfer management service.
                    </p>
                  </div>

                  <div className="h-px bg-[#22251e]/8 my-6" />

                  {/* Payment Details */}
                  <div>
                    <h4 className="text-[13px] text-[#22251e]/60 mb-4">
                      Payment Details
                    </h4>

                    <div className="flex gap-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#22251e]/40">
                          AMOUNT PAID
                        </p>
                        <p className="text-[16px] font-semibold text-[#22251e]">
                          ${(amount_total / 100).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#22251e]/40">
                          STATUS
                        </p>
                        <p className="text-[14px] font-medium text-green-600">
                          {isPaymentSuccessful ? "Paid" : "Processing"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Summary Card */}
                <div className="lg:w-[280px] flex-shrink-0">
                  <div className="rounded-xl border border-[#22251e]/8 bg-[#eaf6d4] p-6">
                    <h3 className="text-[16px] font-semibold text-[#22251e] mb-2">
                      Purchase Summary
                    </h3>
                    <p className="text-[13px] text-[#22251e]/50 mb-6">
                      Your purchase has been confirmed.
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-medium text-[#22251e]">
                        {metadata.tierName}
                      </span>
                      <span className="text-[12px] text-[#22251e]/50">
                        {tierSubtitle}
                      </span>
                    </div>

                    <div className="h-px bg-[#22251e]/8 my-4" />

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[14px] font-semibold text-[#22251e]">
                        Total Paid
                      </span>
                      <span className="text-[18px] font-bold text-[#22251e]">
                        ${(amount_total / 100).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <Link
                      href="/"
                      className="w-full py-3 rounded-xl bg-[#22251e] text-[#f4ffe0] text-[14px] font-medium cursor-pointer hover:bg-[#22251e]/85 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Done
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/40 text-sm mt-8">
          A confirmation email has been sent to {sessionData.customer_email}
        </p>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
