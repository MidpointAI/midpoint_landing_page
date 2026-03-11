"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  FileText,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";

// ============================================================================
// STRIPE SETUP
// ============================================================================

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Custom appearance for Stripe Elements to match modal theme
const stripeAppearance = {
  theme: "flat" as const,
  variables: {
    colorPrimary: "#22251e",
    colorBackground: "#f4ffe0",
    colorText: "#22251e",
    colorTextSecondary: "rgba(34, 37, 30, 0.6)",
    colorTextPlaceholder: "rgba(34, 37, 30, 0.35)",
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
      color: "rgba(34, 37, 30, 0.7)",
      fontWeight: "500",
      fontSize: "13px",
      marginBottom: "6px",
    },
    ".Input": {
      backgroundColor: "#f4ffe0",
      border: "1px solid rgba(34, 37, 30, 0.12)",
      boxShadow: "none",
      padding: "12px 14px",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    },
    ".Input:focus": {
      border: "1px solid rgba(34, 37, 30, 0.3)",
      boxShadow: "0 0 0 3px rgba(34, 37, 30, 0.06)",
    },
    ".Input:hover": {
      border: "1px solid rgba(34, 37, 30, 0.2)",
    },
    ".Input--invalid": {
      border: "1px solid #dc2626",
    },
    ".Tab": {
      backgroundColor: "transparent",
      border: "1px solid rgba(34, 37, 30, 0.12)",
      boxShadow: "none",
      color: "rgba(34, 37, 30, 0.7)",
      fontWeight: "500",
    },
    ".Tab:hover": {
      backgroundColor: "rgba(34, 37, 30, 0.03)",
      border: "1px solid rgba(34, 37, 30, 0.2)",
      color: "#22251e",
    },
    ".Tab--selected": {
      backgroundColor: "#22251e",
      border: "1px solid #22251e",
      color: "#f4ffe0",
      boxShadow: "none",
    },
    ".Tab--selected:hover": {
      backgroundColor: "#22251e",
      border: "1px solid #22251e",
      color: "#f4ffe0",
    },
    ".TabIcon--selected": {
      fill: "#f4ffe0",
    },
    ".TabLabel--selected": {
      color: "#f4ffe0",
    },
    ".Block": {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
    },
    ".CheckboxInput": {
      backgroundColor: "#f4ffe0",
      border: "1px solid rgba(34, 37, 30, 0.2)",
    },
    ".CheckboxInput--checked": {
      backgroundColor: "#22251e",
      borderColor: "#22251e",
    },
  },
};

// ============================================================================
// TYPES
// ============================================================================

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  companyName: string;
  yourName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  activeSubs: string;
  activeProjects: string;
  tosAccepted: boolean;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface FormFieldProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  required?: boolean;
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#22251e]/70 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-[#22251e]/10 bg-[#f4ffe0] text-[14px] text-[#22251e] placeholder:text-[#22251e]/30 focus:border-[#22251e]/25 focus:outline-none transition-all duration-150"
      />
    </div>
  );
}

interface SmallInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

function SmallInput({ placeholder, value, onChange }: SmallInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full px-4 py-3 rounded-lg border border-[#22251e]/10 bg-[#f4ffe0] text-[14px] text-[#22251e] placeholder:text-[#22251e]/30 focus:border-[#22251e]/25 focus:outline-none transition-all duration-150"
    />
  );
}

// ============================================================================
// STEP INDICATOR
// ============================================================================

const steps = [
  { label: "Account", icon: FileText },
  { label: "Payment", icon: CreditCard },
];

interface StepIndicatorProps {
  activeStep: number;
  onStepClick: (index: number) => void;
  completedSteps: number[];
}

function StepIndicator({
  activeStep,
  onStepClick,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-center gap-1 px-6 py-4 bg-[#f4ffe0]/95 backdrop-blur-sm border-b border-[#22251e]/5">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeStep;
        const isCompleted = completedSteps.includes(index);
        const canClick = isCompleted || index <= Math.max(...completedSteps, 0);

        let colorClass = "";
        if (isActive) {
          colorClass = "bg-[#22251e] text-[#f4ffe0]";
        } else if (isCompleted) {
          colorClass = "text-[#22251e]/70 hover:text-[#22251e]";
        } else {
          colorClass = "text-[#22251e]/30";
        }

        return (
          <button
            key={step.label}
            onClick={() => canClick && onStepClick(index)}
            disabled={!canClick}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${colorClass} ${
              canClick ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {step.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// PAYMENT FORM COMPONENT (inside CheckoutProvider)
// ============================================================================

interface PaymentFormProps {
  annualPrice: string;
  formData: FormData;
  onBack: () => void;
  onSuccess: () => void;
}

function PaymentForm({
  annualPrice,
  formData,
  onBack,
  onSuccess,
}: PaymentFormProps) {
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
        setErrorMessage(
          result.error.message || "An error occurred during payment."
        );
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#22251e]/40" />
          <p className="text-[13px] text-[#22251e]/50">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
      {/* Content */}
      <div className="flex-1 px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-4">
        {/* Centered container for cleaner look */}
        <div className="max-w-[520px] mx-auto">
          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#22251e]/40 font-mono mb-2">
              SECURE CHECKOUT
            </p>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#22251e] tracking-tight">
              Complete Your Purchase
            </h2>
          </div>

          {/* Order Summary - Compact layout */}
          <div className="rounded-xl border border-[#22251e]/10 bg-[#22251e]/[0.03] p-3 sm:p-4 mb-4 sm:mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[#22251e]/40">Subs</span>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-[#22251e] tabular-nums">
                    {formData.activeSubs || "0"}
                  </span>
                </div>
                <div className="w-px h-4 bg-[#22251e]/10" />
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[#22251e]/40">Projects</span>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-[#22251e] tabular-nums">
                    {formData.activeProjects || "0"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wide text-[#22251e]/40 mb-0.5">Total</p>
                <p className="text-[16px] sm:text-[18px] font-bold text-[#22251e] tabular-nums">${annualPrice}</p>
              </div>
            </div>
          </div>

          {/* Stripe Payment Element - Clean container */}
          <div className="mb-4">
            <PaymentElement
              options={{
                layout: "tabs",
              }}
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12px] sm:text-[13px]">
              {errorMessage}
            </div>
          )}

          {/* Security badge */}
          <p className="text-center text-[10px] sm:text-[11px] text-[#22251e]/40 flex items-center justify-center gap-1.5">
            <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secured by Stripe · 256-bit SSL
          </p>
        </div>
      </div>

      {/* Navigation - Pinned to bottom */}
      <div className="px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 pt-4 border-t border-[#22251e]/5">
        <div className="max-w-[520px] mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-[#22251e]/15 bg-transparent text-[#22251e]/70 text-[13px] sm:text-[14px] font-medium cursor-pointer hover:bg-[#22251e]/[0.03] hover:border-[#22251e]/25 hover:text-[#22251e] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-[2] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#22251e] text-[#f4ffe0] text-[13px] sm:text-[14px] font-medium cursor-pointer hover:bg-[#22251e]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay ${annualPrice}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export default function SignupModal({ open, onClose }: SignupModalProps) {
  // State
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [accountSubStep, setAccountSubStep] = useState(0); // 0 = Business Info, 1 = Quote
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    yourName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    activeSubs: "",
    activeProjects: "",
    tosAccepted: false,
  });

  // Update form data helper
  const updateFormData = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Calculate load factor
  const loadFactor = useMemo(() => {
    const projects = parseInt(formData.activeProjects) || 0;
    return 1 + projects * 0.05;
  }, [formData.activeProjects]);

  // Calculate annual price
  const annualPrice = useMemo(() => {
    const subs = parseInt(formData.activeSubs) || 0;
    const calculatedFee = 100 * subs * loadFactor;
    return Math.max(6000, calculatedFee).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [formData.activeSubs, loadFactor]);

  // Create checkout session
  const createCheckoutSession = useCallback(async () => {
    setIsCreatingSession(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: formData.email,
          customerName: formData.yourName,
          companyName: formData.companyName,
          activeSubs: formData.activeSubs,
          activeProjects: formData.activeProjects,
        }),
      });

      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setActiveStep(1);
        setCompletedSteps((prev) => [...new Set([...prev, 0])]);
      } else {
        console.error("Failed to create checkout session:", data.error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsCreatingSession(false);
    }
  }, [formData]);

  // Handle Business Info continue (to Quote sub-page)
  const handleBusinessInfoContinue = useCallback(() => {
    if (
      !formData.companyName ||
      !formData.yourName ||
      !formData.email ||
      !formData.tosAccepted
    ) {
      alert("Please fill in all required fields and accept the Terms of Service.");
      return;
    }
    setAccountSubStep(1);
  }, [formData]);

  // Handle Quote continue (to Payment step)
  const handleQuoteContinue = useCallback(() => {
    createCheckoutSession();
  }, [createCheckoutSession]);

  // Handle payment success - Stripe will redirect to success page via return_url
  const handlePaymentSuccess = useCallback(() => {
    // Payment successful - Stripe handles redirect to /signup/success
    // Close modal and let the redirect happen
    onClose();
  }, [onClose]);

  // Handle step navigation
  const handleStepClick = useCallback(
    (index: number) => {
      if (completedSteps.includes(index) || index === 0) {
        setActiveStep(index);
        if (index === 0) {
          setAccountSubStep(0); // Reset to first sub-page when clicking Account
        }
      }
    },
    [completedSteps]
  );

  // Handle open/close transitions
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setActiveStep(0);
        setAccountSubStep(0);
        setCompletedSteps([]);
        setClientSecret(null);
      }, 300);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign up"
        className={`relative z-10 w-full max-w-[780px] max-h-[calc(100svh-2rem)] sm:max-h-[90svh] overflow-y-auto scroll-smooth rounded-2xl bg-[#f4ffe0] shadow-2xl shadow-black/30 scrollbar-hide transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-[#22251e]/40 hover:text-[#22251e]/80 hover:bg-[#22251e]/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator */}
        <StepIndicator
          activeStep={activeStep}
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
        />

        {/* Content Container - Responsive Height */}
        <div className="min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col">
          {/* ================================================================ */}
          {/* ACCOUNT STEP - SUB-PAGE 1: BUSINESS INFO */}
          {/* ================================================================ */}
          {activeStep === 0 && accountSubStep === 0 && (
            <div className="flex-1 flex flex-col">
              {/* Content */}
              <div className="flex-1 px-5 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-4 sm:pb-6">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                  {/* Left column */}
                  <div className="lg:w-[180px] flex-shrink-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#22251e]/40 font-mono mb-3">
                      SIGN UP &rarr;
                    </p>
                    <h2 className="text-[22px] font-semibold text-[#22251e] tracking-tight leading-tight mb-2">
                      Business Info
                    </h2>
                    <p className="text-[13px] text-[#22251e]/50 leading-relaxed">
                      Tell us about your company.
                    </p>
                  </div>

                  {/* Right column */}
                  <div className="flex-1 max-w-[460px]">
                    <div className="flex flex-col gap-4">
                      <FormField
                        label="Company Name"
                        placeholder="Builder Inc."
                        value={formData.companyName}
                        onChange={(v) => updateFormData("companyName", v)}
                        required
                      />
                      <FormField
                        label="Your Name"
                        placeholder="Full name"
                        value={formData.yourName}
                        onChange={(v) => updateFormData("yourName", v)}
                        required
                      />
                      <FormField
                        label="Email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(v) => updateFormData("email", v)}
                        type="email"
                        required
                      />
                      <FormField
                        label="Phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(v) => updateFormData("phone", v)}
                        type="tel"
                      />
                      <FormField
                        label="Business Address"
                        placeholder="Number, Street, Unit"
                        value={formData.address}
                        onChange={(v) => updateFormData("address", v)}
                      />

                      {/* City/State/Zip row */}
                      <div className="grid grid-cols-3 gap-3">
                        <SmallInput
                          placeholder="City"
                          value={formData.city}
                          onChange={(v) => updateFormData("city", v)}
                        />
                        <SmallInput
                          placeholder="State"
                          value={formData.state}
                          onChange={(v) => updateFormData("state", v)}
                        />
                        <SmallInput
                          placeholder="Zip"
                          value={formData.zip}
                          onChange={(v) => updateFormData("zip", v)}
                        />
                      </div>

                      {/* Terms of Service */}
                      <label className="flex items-center gap-3 cursor-pointer group mt-1">
                        <input
                          type="checkbox"
                          checked={formData.tosAccepted}
                          onChange={(e) =>
                            updateFormData("tosAccepted", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded border border-[#22251e]/20 bg-[#f4ffe0] flex items-center justify-center peer-checked:bg-[#22251e] peer-checked:border-[#22251e] transition-colors">
                          {formData.tosAccepted && (
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                              <path
                                d="M1 5L4 8L11 1"
                                stroke="#f4ffe0"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-[13px] text-[#22251e]/60 group-hover:text-[#22251e]/80 transition-colors">
                          I agree to the{" "}
                          <span className="underline underline-offset-2">Terms of Service</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation - Pinned to bottom */}
              <div className="px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 pt-4 border-t border-[#22251e]/5">
                <div className="flex justify-end">
                  <button
                    onClick={handleBusinessInfoContinue}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-[#22251e] text-[#f4ffe0] text-[13px] sm:text-[14px] font-medium cursor-pointer hover:bg-[#22251e]/90 transition-colors flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* ACCOUNT STEP - SUB-PAGE 2: QUOTE */}
          {/* ================================================================ */}
          {activeStep === 0 && accountSubStep === 1 && (
            <div className="flex-1 flex flex-col">
              {/* Content */}
              <div className="flex-1 px-5 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-4 sm:pb-6">
                {/* Section 1: Current active subs */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
                  {/* Left column */}
                  <div className="lg:w-[180px] flex-shrink-0">
                    <h2 className="text-[20px] font-semibold text-[#22251e] tracking-tight leading-tight mb-2">
                      Current active subs
                    </h2>
                    <p className="text-[12px] text-[#22251e]/50 leading-relaxed">
                      Estimate of active subs you&apos;re currently working with.
                    </p>
                  </div>

                  {/* Right column */}
                  <div className="flex-1 max-w-[460px]">
                    <FormField
                      label="# of Currently Active Subs"
                      placeholder="e.g. 150"
                      value={formData.activeSubs}
                      onChange={(v) => updateFormData("activeSubs", v)}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#22251e]/8 my-6" />

                {/* Section 2: Operations */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
                  {/* Left column */}
                  <div className="lg:w-[180px] flex-shrink-0">
                    <h2 className="text-[20px] font-semibold text-[#22251e] tracking-tight leading-tight mb-2">
                      Operations
                    </h2>
                    <p className="text-[12px] text-[#22251e]/50 leading-relaxed">
                      Questions about your business operations.
                    </p>
                  </div>

                  {/* Right column */}
                  <div className="flex-1 max-w-[460px]">
                    <FormField
                      label="Current Active Projects"
                      placeholder="e.g. 10"
                      value={formData.activeProjects}
                      onChange={(v) => updateFormData("activeProjects", v)}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#22251e]/8 my-6" />

                {/* Section 3: Annual cost */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
                  {/* Left column */}
                  <div className="lg:w-[180px] flex-shrink-0">
                    <h2 className="text-[20px] font-semibold text-[#22251e] tracking-tight leading-tight mb-2">
                      Annual cost
                    </h2>
                    <p className="text-[12px] text-[#22251e]/50 leading-relaxed">
                      Based on your current projects and vendors
                    </p>
                  </div>

                  {/* Right column - Summary Card */}
                  <div className="flex-1 max-w-[460px]">
                    <div className="rounded-xl border border-[#22251e]/8 bg-[#eef5dc] p-5">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-[#22251e]/60">Currently active subs</span>
                          <span className="text-[15px] font-semibold text-[#22251e] tabular-nums">
                            {formData.activeSubs || "0"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-[#22251e]/60">Active projects</span>
                          <span className="text-[15px] font-semibold text-[#22251e] tabular-nums">
                            {formData.activeProjects || "0"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-[#22251e]/60">Load Factor</span>
                          <span className="text-[15px] font-semibold text-[#22251e] tabular-nums">
                            {loadFactor.toFixed(2)}x
                          </span>
                        </div>

                        <div className="h-px bg-[#22251e]/10 my-1" />

                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-semibold text-[#22251e]">Total Today</span>
                          <span className="text-[18px] font-bold text-[#22251e] tabular-nums">
                            ${annualPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Learn more link */}
                    <a
                      href="/pricing/how-it-works"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-[12px] text-[#22251e]/50 hover:text-[#22251e]/70 underline underline-offset-2 mt-2 transition-colors"
                    >
                      How is this calculated?
                    </a>
                  </div>
                </div>
              </div>

              {/* Navigation - Pinned to bottom */}
              <div className="px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 pt-4 border-t border-[#22251e]/5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setAccountSubStep(0)}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-[#22251e]/20 bg-transparent text-[#22251e]/70 text-[13px] sm:text-[14px] font-medium cursor-pointer hover:bg-[#22251e]/5 hover:border-[#22251e]/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleQuoteContinue}
                    disabled={isCreatingSession}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#22251e] text-[#f4ffe0] text-[13px] sm:text-[14px] font-medium cursor-pointer hover:bg-[#22251e]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingSession ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Move Forward</span>
                        <span className="sm:hidden">Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* PAYMENT STEP */}
          {/* ================================================================ */}
          {activeStep === 1 && clientSecret && (
            <CheckoutProvider
              stripe={stripePromise}
              options={{
                clientSecret,
                elementsOptions: {
                  appearance: stripeAppearance,
                },
              }}
            >
              <PaymentForm
                annualPrice={annualPrice}
                formData={formData}
                onBack={() => {
                  setActiveStep(0);
                  setAccountSubStep(1);
                }}
                onSuccess={handlePaymentSuccess}
              />
            </CheckoutProvider>
          )}

        </div>
      </div>
    </div>
  );
}
