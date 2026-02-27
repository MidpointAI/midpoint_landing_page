"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import Navbar from "@/components/navbar";
import {
  Check,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
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
  const confettiTriggered = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Trigger confetti on successful payment
  useEffect(() => {
    if (sessionData && sessionData.payment_status === "paid" && !confettiTriggered.current) {
      confettiTriggered.current = true;

      const end = Date.now() + 3 * 1000;
      const colors = ["#c8e66e", "#a3d134", "#22251e", "#86efac", "#4ade80"];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
    }
  }, [sessionData]);

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
      <>
        <Navbar />
        <div className="pt-[72px] min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading payment details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !sessionData) {
    return (
      <>
        <Navbar />
        <div className="pt-[72px] min-h-screen bg-background flex items-center justify-center px-6">
          <div className="max-w-md w-full">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground mb-1">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground text-sm">
                  {error || "Unable to load payment details."}
                </p>
              </div>
            </div>
            <div className="mt-6 pl-[68px]">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" />
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { metadata, amount_total, payment_status } = sessionData;
  const isPaymentSuccessful = payment_status === "paid";

  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6">
          {/* Hero Section - Properly Centered */}
          <section className="py-12 lg:py-14 border-b border-border">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-primary/15">
                <Check className="w-7 h-7 text-primary" strokeWidth={3} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
                  Payment Confirmed
                </p>
                <h1 className="text-2xl lg:text-[28px] font-bold text-foreground tracking-tight">
                  Welcome to Midpoint!
                </h1>
              </div>
            </div>
          </section>

          {/* Order Details - Compact Two-Column Layout */}
          <section className="py-8 border-b border-border">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-5">
              Order Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {/* Left Column - Transaction Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="text-sm font-medium text-foreground">{metadata.tierName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    ${(amount_total / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subs / Projects</span>
                  <span className="text-sm font-medium text-foreground tabular-nums">
                    {metadata.activeSubs} / {metadata.activeProjects}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Billing</span>
                  <span className="text-sm font-medium text-foreground">Annual</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {isPaymentSuccessful ? "Paid" : "Processing"}
                  </span>
                </div>
              </div>

              {/* Right Column - Account Info */}
              <div className="space-y-4 md:border-l md:border-border/40 md:pl-10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Company</span>
                  <span className="text-sm font-medium text-foreground truncate ml-4">
                    {metadata.companyName || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contact</span>
                  <span className="text-sm font-medium text-foreground truncate ml-4">
                    {metadata.customerName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium text-foreground truncate ml-4">
                    {sessionData.customer_email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Renewal</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="py-8">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
              Next Steps
            </h2>
            <p className="text-foreground text-sm leading-relaxed mb-5">
              A confirmation email has been sent to{" "}
              <span className="font-medium">{sessionData.customer_email}</span>.
              Our team will reach out within 24 hours to help you get started.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/midpointverified"
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Set up your account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="mailto:hello@midpoint.com"
                className="px-6 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:border-foreground/40 transition-colors text-center"
              >
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <div className="pt-[72px] min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
