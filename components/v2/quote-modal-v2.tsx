"use client";

import { useEffect, useState, Fragment, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  Loader2,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const stripeAppearance = {
  theme: "flat" as const,
  variables: {
    colorPrimary: "#18181b",
    colorBackground: "#f4fce3",
    colorText: "#18181b",
    colorTextSecondary: "rgba(24, 24, 27, 0.6)",
    colorTextPlaceholder: "rgba(24, 24, 27, 0.35)",
    colorDanger: "#dc2626",
    fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
    fontSizeBase: "14px",
    fontWeightNormal: "400",
    fontWeightMedium: "500",
    fontWeightBold: "600",
    borderRadius: "10px",
    spacingUnit: "4px",
    spacingGridRow: "16px",
    spacingGridColumn: "16px",
  },
  rules: {
    ".Label": {
      color: "rgba(24, 24, 27, 0.7)",
      fontWeight: "500",
      fontSize: "13px",
      marginBottom: "6px",
    },
    ".Input": {
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      border: "1px solid rgba(24, 24, 27, 0.12)",
      boxShadow: "none",
      padding: "12px 14px",
    },
    ".Input:focus": {
      border: "1px solid rgba(24, 24, 27, 0.4)",
      boxShadow: "0 0 0 3px rgba(24, 24, 27, 0.06)",
    },
    ".Tab": {
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      border: "1px solid rgba(24, 24, 27, 0.12)",
      boxShadow: "none",
      color: "rgba(24, 24, 27, 0.7)",
      fontWeight: "500",
    },
    ".Tab--selected": {
      backgroundColor: "#18181b",
      border: "1px solid #18181b",
      color: "#ffffff",
    },
    ".TabIcon--selected": { fill: "#ffffff" },
    ".TabLabel--selected": { color: "#ffffff" },
  },
};

type ProjectValueRange = "under750k" | "750k-2m" | "2m-5m" | "5mplus";

const PROJECT_VALUE_OPTIONS: { id: ProjectValueRange; label: string }[] = [
  { id: "under750k", label: "Under $750K" },
  { id: "750k-2m", label: "$750K – $2M" },
  { id: "2m-5m", label: "$2M – $5M" },
  { id: "5mplus", label: "$5M+" },
];

function calculatePrice(subs: number): number {
  if (subs <= 25) return 6000;
  if (subs <= 100) return subs * 125;
  return subs * 150;
}

const WIZARD_STEPS = ["Business Info", "Operations", "Your Quote", "Payment"];

function getWizardStep(step: number): number {
  if (step <= 1) return 1;
  if (step <= 2) return 2;
  if (step <= 4) return 3;
  return 4;
}

interface QuoteModalV2Props {
  onClose: () => void;
}

interface FormState {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  terms: boolean;
  activeSubs: string;
  activeProjects: string;
  projectValueRange: ProjectValueRange;
}

interface PaymentFormProps {
  price: number;
  subsCount: number;
  projectsCount: number;
  onBack: () => void;
}

function PaymentForm({ price, subsCount, projectsCount, onBack }: PaymentFormProps) {
  const checkout = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoading = checkout.type === "loading";
  const isReady = checkout.type === "success";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady) {
      setErrorMessage("Payment form is not ready. Please wait.");
      return;
    }
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      if (checkout.type !== "success") {
        setErrorMessage("Payment form is not ready.");
        setIsProcessing(false);
        return;
      }
      const result = await checkout.checkout.confirm();
      if (result.type === "error") {
        setErrorMessage(result.error.message || "An error occurred during payment.");
        setIsProcessing(false);
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-500">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Secure Checkout
        </p>
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Complete Your Purchase
        </h2>
      </div>

      <div className="bg-white/60 border border-zinc-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Subs
            </p>
            <p className="text-lg font-medium text-zinc-900 tabular-nums">
              {subsCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Projects
            </p>
            <p className="text-lg font-medium text-zinc-900 tabular-nums">
              {projectsCount}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            Total
          </p>
          <p className="text-2xl font-bold text-zinc-900 tabular-nums">
            ${price.toLocaleString()}.00
          </p>
        </div>
      </div>

      <div>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <p className="text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secured by Stripe · 256-bit SSL
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-3 rounded-xl border border-zinc-300 bg-transparent text-zinc-700 text-sm font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="flex-[2] px-6 py-3 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay ${price.toLocaleString()}.00
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function QuoteModalV2({ onClose }: QuoteModalV2Props) {
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    terms: false,
    activeSubs: "",
    activeProjects: "",
    projectValueRange: "2m-5m",
  });

  const updateForm = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const subsCount = useMemo(() => parseInt(form.activeSubs) || 0, [form.activeSubs]);
  const projectsCount = useMemo(
    () => parseInt(form.activeProjects) || 0,
    [form.activeProjects]
  );
  const price = useMemo(() => calculatePrice(subsCount), [subsCount]);
  const wizardStep = getWizardStep(step);

  // Auto-advance from calculating (step 3) to quote (step 4)
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => setStep(4), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== 5) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, step]);

  const validateBusinessInfo = () => {
    if (!form.companyName || !form.name || !form.email || !form.terms) {
      alert("Please fill in all required fields and accept the Terms of Service.");
      return false;
    }
    return true;
  };

  const validateOperations = () => {
    if (!form.activeSubs || subsCount <= 0) {
      alert("Please enter the number of currently active subs.");
      return false;
    }
    return true;
  };

  const createCheckoutSession = useCallback(async () => {
    setIsCreatingSession(true);
    setSessionError(null);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: form.email,
          customerName: form.name,
          companyName: form.companyName,
          activeSubs: form.activeSubs,
          activeProjects: form.activeProjects,
          projectValueRange: form.projectValueRange,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
        }),
      });
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep(5);
      } else {
        setSessionError(data.error || "Failed to create checkout session.");
      }
    } catch {
      setSessionError("Could not connect to payment service.");
    } finally {
      setIsCreatingSession(false);
    }
  }, [form]);

  const handleNext = () => {
    if (step === 1) {
      if (!validateBusinessInfo()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateOperations()) return;
      setStep(3);
    } else if (step === 4) {
      createCheckoutSession();
    }
  };

  const handleBack = () => {
    if (step === 4) setStep(2);
    else if (step === 5) setStep(4);
    else setStep((s) => Math.max(s - 1, 1));
  };

  const handleBackdropClick = () => {
    if (step !== 5) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#f4fce3] rounded-2xl shadow-2xl flex flex-col">
        {/* Header / Step Wizard */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-zinc-200/50 bg-[#f4fce3]/95 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-900/10 transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1">
            {WIZARD_STEPS.map((label, i) => {
              const stepNum = i + 1;
              const isActive = wizardStep === stepNum;
              const isCompleted = wizardStep > stepNum;
              return (
                <Fragment key={label}>
                  {i > 0 && (
                    <div
                      className={`h-px w-8 mx-1 transition-colors ${
                        isCompleted ? "bg-zinc-900" : "bg-zinc-300"
                      }`}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        isCompleted || isActive
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-200 text-zinc-500"
                      }`}
                    >
                      {isCompleted ? <CheckIcon className="h-3 w-3" /> : stepNum}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:inline transition-colors ${
                        isActive
                          ? "text-zinc-900"
                          : isCompleted
                          ? "text-zinc-600"
                          : "text-zinc-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-10">
          <AnimatePresence mode="wait">
            {/* STEP 1: Business Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-10"
              >
                <div className="md:col-span-4 space-y-4">
                  <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                    Sign Up &rarr;
                  </p>
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
                    Business Info
                  </h2>
                  <p className="text-zinc-500">Tell us about your company.</p>
                </div>
                <div className="md:col-span-8 space-y-5">
                  <FieldLabel required>Company Name</FieldLabel>
                  <FieldInput
                    value={form.companyName}
                    onChange={(v) => updateForm("companyName", v)}
                    placeholder="Builder Inc."
                  />
                  <FieldLabel required>Your Name</FieldLabel>
                  <FieldInput
                    value={form.name}
                    onChange={(v) => updateForm("name", v)}
                    placeholder="Full name"
                  />
                  <FieldLabel required>Email</FieldLabel>
                  <FieldInput
                    type="email"
                    value={form.email}
                    onChange={(v) => updateForm("email", v)}
                    placeholder="you@company.com"
                  />
                  <FieldLabel>Phone</FieldLabel>
                  <FieldInput
                    type="tel"
                    value={form.phone}
                    onChange={(v) => updateForm("phone", v)}
                    placeholder="+1 (555) 000-0000"
                  />
                  <FieldLabel>Business Address</FieldLabel>
                  <FieldInput
                    value={form.address}
                    onChange={(v) => updateForm("address", v)}
                    placeholder="Number, Street, Unit"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <FieldInput
                      value={form.city}
                      onChange={(v) => updateForm("city", v)}
                      placeholder="City"
                    />
                    <FieldInput
                      value={form.state}
                      onChange={(v) => updateForm("state", v)}
                      placeholder="State"
                    />
                    <FieldInput
                      value={form.zip}
                      onChange={(v) => updateForm("zip", v)}
                      placeholder="Zip"
                    />
                  </div>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={(e) => updateForm("terms", e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    <span className="text-sm text-zinc-600">
                      I agree to the{" "}
                      <span className="underline cursor-pointer">Terms of Service</span>
                    </span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Operations */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-4 space-y-4">
                    <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Operations &rarr;
                    </p>
                    <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
                      Current active subs
                    </h2>
                    <p className="text-zinc-500">
                      Estimate of active subs you&apos;re currently working with.
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <FieldLabel># of Currently Active Subs</FieldLabel>
                    <FieldInput
                      type="number"
                      value={form.activeSubs}
                      onChange={(v) => updateForm("activeSubs", v)}
                      placeholder="e.g. 150"
                      large
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-200/60" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-4 space-y-4">
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                      Active Projects
                    </h2>
                    <p className="text-zinc-500">
                      How many projects are you currently managing?
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <FieldLabel>Current Active Projects</FieldLabel>
                    <FieldInput
                      type="number"
                      value={form.activeProjects}
                      onChange={(v) => updateForm("activeProjects", v)}
                      placeholder="e.g. 12"
                      large
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-200/60" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-4 space-y-4">
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                      Average Project Size
                    </h2>
                    <p className="text-zinc-500">
                      Select the range that best represents your typical project value.
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <div className="grid grid-cols-2 gap-3">
                      {PROJECT_VALUE_OPTIONS.map((option) => {
                        const isSelected = form.projectValueRange === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => updateForm("projectValueRange", option.id)}
                            className={`rounded-xl border-2 p-4 text-left transition-all duration-150 ${
                              isSelected
                                ? "border-zinc-900 bg-zinc-900/5"
                                : "border-zinc-200 bg-white/50 hover:border-zinc-300"
                            }`}
                          >
                            <p
                              className={`text-sm font-semibold ${
                                isSelected ? "text-zinc-900" : "text-zinc-700"
                              }`}
                            >
                              {option.label}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">per project avg</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Calculating */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-20 space-y-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="h-12 w-12 rounded-full border-2 border-zinc-200 border-t-zinc-900"
                />
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    Calculating your quote
                  </h2>
                  <p className="text-zinc-500 max-w-sm mx-auto">
                    Analyzing your portfolio size, project volume, and compliance
                    requirements...
                  </p>
                </div>
                <div className="flex gap-6 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-2xl font-bold text-zinc-900">{subsCount}</p>
                    <p className="text-xs text-zinc-500">Active Subs</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-2xl font-bold text-zinc-900">{projectsCount}</p>
                    <p className="text-xs text-zinc-500">Projects</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <p className="text-2xl font-bold text-zinc-900">
                      {PROJECT_VALUE_OPTIONS.find((o) => o.id === form.projectValueRange)
                        ?.label ?? "—"}
                    </p>
                    <p className="text-xs text-zinc-500">Avg Size</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Quote */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-10"
              >
                <div className="md:col-span-4 space-y-4">
                  <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                    Your Quote &rarr;
                  </p>
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
                    Annual Cost
                  </h2>
                  <p className="text-zinc-500">
                    Based on your business profile and compliance needs.
                  </p>
                </div>
                <div className="md:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white/60 border border-zinc-200 rounded-2xl p-8 text-center space-y-4 shadow-sm"
                  >
                    <p className="text-zinc-500 font-medium">Your annual service cost</p>
                    <p className="text-5xl font-bold text-zinc-900 tracking-tight">
                      ${price.toLocaleString()}
                      <span className="text-lg font-medium text-zinc-400">.00</span>
                    </p>
                    <p className="text-sm text-zinc-500">
                      Billed annually · Cancel anytime
                    </p>
                  </motion.div>
                  {sessionError && (
                    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      {sessionError}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Payment (real Stripe) */}
            {step === 5 && clientSecret && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <CheckoutProvider
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    elementsOptions: { appearance: stripeAppearance },
                  }}
                >
                  <PaymentForm
                    price={price}
                    subsCount={subsCount}
                    projectsCount={projectsCount}
                    onBack={handleBack}
                  />
                </CheckoutProvider>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer (hidden on calculating + payment) */}
        {step !== 3 && step !== 5 && (
          <div className="sticky bottom-0 z-10 flex items-center justify-between px-6 py-4 border-t border-zinc-200/50 bg-[#f4fce3]/95 backdrop-blur-md rounded-b-2xl">
            <div>
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-900/5 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back
                </button>
              )}
            </div>
            <button
              onClick={handleNext}
              disabled={isCreatingSession}
              className="px-8 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingSession ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  {step === 4 ? "Move Forward" : step === 2 ? "Get My Quote" : "Continue"}
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldInput({
  type = "text",
  value,
  onChange,
  placeholder,
  large,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  large?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-white/50 border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
        large ? "px-4 py-4 text-lg" : "px-3 py-2 text-sm"
      }`}
    />
  );
}
