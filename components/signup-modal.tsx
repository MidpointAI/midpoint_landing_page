"use client";

import { useState, useEffect, useCallback } from "react";
import { X, FileText, CreditCard, CheckCircle2, ArrowRight } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function Separator() {
  return <div className="mx-8 lg:mx-12 h-px bg-[#22251e]/8" />;
}

interface FormFieldProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

function FormField({ label, placeholder, value, onChange }: FormFieldProps) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#22251e]/60 mb-1.5">
        {label}
      </label>
      <InputBox
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

interface InputBoxProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

function InputBox({ placeholder, value, onChange }: InputBoxProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg border border-[#22251e]/12 bg-white text-[13px] text-[#22251e] placeholder:text-[#22251e]/25 focus:border-[#22251e]/30 focus:ring-2 focus:ring-[#22251e]/5 outline-none transition-all duration-150"
    />
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[#22251e]/45">{label}</span>
      <span className="text-[15px] font-semibold text-[#22251e] tabular-nums">
        {value}
      </span>
    </div>
  );
}

// ============================================================================
// STEP INDICATOR
// ============================================================================

const steps = [
  { label: "Account", icon: FileText },
  { label: "Payment", icon: CreditCard },
  { label: "Confirm Purchase", icon: CheckCircle2 },
];

interface StepIndicatorProps {
  activeStep: number;
  onStepClick: (index: number) => void;
}

function StepIndicator({ activeStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-center gap-1 px-6 py-4 bg-[#f4ffe0]/95 backdrop-blur-sm">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const isFuture = index > activeStep;

        let colorClass = "";
        if (isActive) {
          colorClass = "bg-[#22251e] text-[#f4ffe0]";
        } else if (isCompleted) {
          colorClass = "text-[#22251e]/70 hover:text-[#22251e]";
        } else if (isFuture) {
          colorClass = "text-[#22251e]/30 hover:text-[#22251e]/50";
        }

        return (
          <button
            key={step.label}
            onClick={() => onStepClick(index)}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-all duration-200 ${colorClass}`}
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
// MAIN MODAL COMPONENT
// ============================================================================

export default function SignupModal({ open, onClose }: SignupModalProps) {
  // State
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeSubs, setActiveSubs] = useState("59");
  const [activeProjects, setActiveProjects] = useState("3");
  const [estimatedProjects, setEstimatedProjects] = useState("7");
  const [tosAccepted, setTosAccepted] = useState(false);

  // Calculate total cost
  const calculateTotal = useCallback(() => {
    const subs = parseInt(activeSubs) || 0;
    const projects = parseInt(activeProjects) || 0;
    const estimated = parseInt(estimatedProjects) || 0;
    const total = subs * 150 + projects * 500 + estimated * 200;
    return total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [activeSubs, activeProjects, estimatedProjects]);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
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
        className={`relative z-10 w-full max-w-[780px] mx-4 my-6 lg:my-10 max-h-[calc(100svh-3rem)] overflow-y-auto scroll-smooth rounded-2xl bg-[#f4ffe0] shadow-2xl shadow-black/30 scrollbar-hide transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
        <StepIndicator activeStep={activeStep} onStepClick={setActiveStep} />

        {/* Section 1: Business Info */}
        <div className="px-8 lg:px-12 pt-10 pb-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left column */}
            <div className="lg:w-[220px] flex-shrink-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#22251e]/40 font-mono mb-2">
                SIGN UP &rarr;
              </p>
              <h2 className="text-xl font-semibold text-[#22251e] tracking-tight leading-tight mb-1.5">
                Business Info
              </h2>
              <p className="text-[13px] text-[#22251e]/40 leading-relaxed">
                Please provide the required details.
              </p>
            </div>

            {/* Right column */}
            <div className="flex-1 flex flex-col gap-4">
              <FormField label="Company Name" placeholder="Builder Inc." />
              <FormField label="Your Name" placeholder="Full name" />
              <FormField label="Email" placeholder="you@company.com" />
              <FormField label="Phone #" placeholder="+1 (555) 000-0000" />
              <FormField
                label="Business Address"
                placeholder="Number, Street, Unit"
              />

              {/* City/State/Zip row */}
              <div className="grid grid-cols-3 gap-3">
                <InputBox placeholder="City" />
                <InputBox placeholder="State" />
                <InputBox placeholder="Zip" />
              </div>

              {/* Footer row */}
              <div className="pt-4 flex items-center justify-between">
                {/* Terms of Service checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={tosAccepted}
                    onChange={(e) => setTosAccepted(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-[#22251e]/20 bg-white flex items-center justify-center peer-checked:bg-[#22251e] peer-checked:border-[#22251e] transition-colors">
                    {tosAccepted && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="#f4ffe0"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-[12px] text-[#22251e]/50 underline underline-offset-2 decoration-[#22251e]/15 font-mono group-hover:text-[#22251e]/70 transition-colors">
                    Terms of Service
                  </span>
                </label>

                {/* Continue button */}
                <button className="px-6 py-2 rounded-lg bg-[#22251e] text-[#f4ffe0] text-[13px] font-medium cursor-pointer hover:bg-[#22251e]/85 transition-colors">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Section 2: Current Active Subs */}
        <div className="px-8 lg:px-12 py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left column */}
            <div className="lg:w-[220px] flex-shrink-0">
              <h2 className="text-xl font-semibold text-[#22251e] tracking-tight leading-tight mb-1.5">
                Current active subs
              </h2>
              <p className="text-[13px] text-[#22251e]/40 leading-relaxed">
                Please provide your estimate for # of active subs you are
                currently working with.
              </p>
            </div>

            {/* Right column */}
            <div className="flex-1">
              <FormField
                label="# of Currently Active Subs"
                placeholder="e.g. 59"
                value={activeSubs}
                onChange={setActiveSubs}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Section 3: Operations */}
        <div className="px-8 lg:px-12 py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left column */}
            <div className="lg:w-[220px] flex-shrink-0">
              <h2 className="text-xl font-semibold text-[#22251e] tracking-tight leading-tight mb-1.5">
                Operations
              </h2>
              <p className="text-[13px] text-[#22251e]/40 leading-relaxed">
                Please answer the following questions about your business
                operations.
              </p>
            </div>

            {/* Right column */}
            <div className="flex-1 flex flex-col gap-4">
              <FormField
                label="Current Active Projects"
                placeholder="e.g. 3"
                value={activeProjects}
                onChange={setActiveProjects}
              />
              <FormField
                label="Estimated Projects per Year"
                placeholder="e.g. 7"
                value={estimatedProjects}
                onChange={setEstimatedProjects}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Section 4: Monthly Cost */}
        <div className="px-8 lg:px-12 pt-10 pb-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left column */}
            <div className="lg:w-[220px] flex-shrink-0">
              <h2 className="text-xl font-semibold text-[#22251e] tracking-tight leading-tight mb-1.5">
                Monthly cost
              </h2>
              <p className="text-[13px] text-[#22251e]/40 leading-relaxed">
                Based on your current projects and vendors
              </p>
            </div>

            {/* Right column */}
            <div className="flex-1">
              {/* Summary card */}
              <div className="rounded-xl border border-[#22251e]/8 bg-[#eaf6d4] p-6">
                <div className="flex flex-col gap-3.5">
                  <SummaryRow
                    label="Currenty active subs"
                    value={activeSubs || "0"}
                  />
                  <SummaryRow
                    label="Active projects"
                    value={activeProjects || "0"}
                  />
                  <SummaryRow
                    label="Avg. Projects/Year"
                    value={estimatedProjects || "0"}
                  />
                </div>

                {/* Divider */}
                <div className="h-px bg-[#22251e]/8 my-5" />

                {/* Total row */}
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#22251e]">
                    Total Today
                  </span>
                  <span className="text-[14px] font-semibold text-[#22251e] tabular-nums">
                    ${calculateTotal()}
                  </span>
                </div>
              </div>

              {/* Move Forward button */}
              <button className="w-full mt-6 py-3 rounded-xl bg-[#22251e] text-[#f4ffe0] text-[14px] font-medium cursor-pointer hover:bg-[#22251e]/85 transition-colors flex items-center justify-center gap-2">
                Move Forward
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
