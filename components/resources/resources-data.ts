import {
  Shield,
  AlertTriangle,
  Scale,
  Car,
  HardHat,
  Umbrella,
  UserPlus,
  Bell,
} from "lucide-react";
import { createElement } from "react";

// Page types for navigation
export type DocPage =
  | "overview"
  | "what-is-midpoint"
  | "proper-risk-transfer"
  | "downloads"
  | "faq"
  | "general-liability"
  | "waiver-of-subrogation"
  | "primary-non-contributory"
  | "auto-liability"
  | "workers-comp"
  | "umbrella-coverage"
  | "additional-insured"
  | "notice-of-cancellation";

// Insurance term type
export interface GlossaryTerm {
  id: DocPage;
  tab: string;
  title: string;
  tagline: string;
  description: string;
  bullets?: string[];
  insights: {
    title: string;
    content: string;
  }[];
  icon: typeof Shield;
}

// Glossary terms data
export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "general-liability",
    tab: "General Liability",
    title: "General Liability Coverage",
    tagline: "Covers damage or injury from sub work",
    description:
      "General Liability covers damage or injury caused by a subcontractor's work -- things like water damage, faulty installation, or someone getting hurt because of their operations.",
    insights: [
      {
        title: "Why it's required",
        content:
          "If a sub causes damage, you don't want the claim landing on your insurance. GL ensures the sub's policy responds first.",
      },
      {
        title: "Why you want to be Additional Insured",
        content:
          "Being listed as Additional Insured means their policy must defend and cover you if their work triggers a claim. Without it, your insurance could be forced to pay even when the sub is responsible.",
      },
    ],
    icon: Shield,
  },
  {
    id: "waiver-of-subrogation",
    tab: "Waiver of Subrogation",
    title: "Waiver of Subrogation",
    tagline: "Prevents upstream blame shifting",
    description: "",
    bullets: [
      "It prevents the subcontractor's insurer from coming after the general contractor if a subcontractor causes damage or injury, blocking action that could shift blame upstream.",
      "It aligns with standard risk transfer practices in construction by ensuring the party closest to the work bears the risk and the subcontractor's insurance is fully responsible for losses arising from their operations.",
      "It protects the general contractor's loss history and insurance costs by helping avoid unnecessary claims against the general contractor's policies that could affect future premiums.",
    ],
    insights: [
      {
        title: "In summary",
        content:
          "A waiver of subrogation is a provision where an insurer agrees that, after covering a loss for its policyholder, it will not seek repayment from any third party that may have contributed to the damage. This provision or endorsement can be applied to many coverages like general liability, workers compensation, and auto liability.",
      },
    ],
    icon: AlertTriangle,
  },
  {
    id: "primary-non-contributory",
    tab: "Primary & Non-Contributory",
    title: "Primary and Non-contributory Insurance",
    tagline: "Defines policy response order",
    description:
      '"Primary and noncontributory" is a contractual insurance requirement that defines how multiple insurance policies must respond to the same loss. When a policy is required to be primary and noncontributory, it means the contractor\'s liability insurance must respond first, before any other applicable policies, and may not seek contribution from other policies that could also be considered primary.',
    insights: [
      {
        title: "Primary Coverage",
        content:
          "This places full initial responsibility on the contractor's policy for covered losses. In other words, the contractor's liability insurance must respond first before any other applicable policies.",
      },
      {
        title: "Noncontributory Requirement",
        content:
          "The contractor's policy may not seek contribution from other policies that could also be considered primary. This helps ensure other parties' insurance is not tapped for the same covered loss at the outset.",
      },
    ],
    icon: Scale,
  },
  {
    id: "auto-liability",
    tab: "Auto Liability",
    title: "Auto Liability Coverage",
    tagline: "Vehicle-related accident protection",
    description:
      "Auto Liability covers accidents caused by vehicles a subcontractor uses for work, trucks, vans, trailers, and equipment moved on public roads.",
    insights: [
      {
        title: "Why it's required",
        content:
          "If a sub's vehicle injures someone or damages property while working on your project, you don't want that liability pushed back to you.",
      },
      {
        title: "Why you want to be Additional Insured",
        content:
          "If a claim involves a vehicle being used for your jobsite or project, being Additional Insured ensures their Auto policy defends you, not yours.",
      },
    ],
    icon: Car,
  },
  {
    id: "workers-comp",
    tab: "Workers' Compensation",
    title: "Workers' Compensation",
    tagline: "Medical bills and lost wages coverage",
    description:
      "Workers Comp pays medical bills and lost wages when a subcontractor's employee gets hurt while working.",
    insights: [
      {
        title: "Why it's required",
        content:
          "If a sub doesn't carry Workers Comp, the injured worker can legally pursue you or the property owner for coverage. It protects you from those claims and ensures legal compliance.",
      },
    ],
    icon: HardHat,
  },
  {
    id: "umbrella-coverage",
    tab: "Umbrella Coverage",
    title: "Umbrella Coverage",
    tagline: "Extra protection above base limits",
    description:
      "Umbrella insurance adds extra protection above a subcontractor's General Liability, Auto, and Workers Comp limits. It's for severe injuries, large fires, or major property damage.",
    insights: [
      {
        title: "Why it's required",
        content:
          "High-severity losses can exceed basic limits quickly. Umbrella coverage ensures the subcontractor has enough financial protection to handle a catastrophic claim -- instead of the GC getting pulled in.",
      },
      {
        title: "Why you want to be Additional Insured",
        content:
          "Additional Insured status on the sub's Umbrella policy means you're protected even for large or high-dollar claims, keeping your own limits untouched.",
      },
    ],
    icon: Umbrella,
  },
  {
    id: "additional-insured",
    tab: "Additional Insured",
    title: "Why Additional Insured Matters",
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
    insights: [
      {
        title: "In summary",
        content:
          "Additional Insured status is what allows you to shift the risk of a subcontractor's work to their insurance -- where it belongs.",
      },
    ],
    icon: UserPlus,
  },
  {
    id: "notice-of-cancellation",
    tab: "30-Day Notice",
    title: "Notice of Cancellation",
    tagline: "Early warning for coverage lapses",
    description:
      "A notice of cancellation is a formal alert from an insurance company stating that a subcontractor's policy will end on a certain date. The insurer must send this notice before the cancellation becomes effective, giving you time to address the issue.",
    insights: [
      {
        title: "Why it matters for General Contractors",
        content:
          "This notice is important because it tells you that a sub's insurance coverage is about to lapse or be terminated. That could be due to missed premium payments, underwriting issues, or other changes in the risk. Once the policy is canceled, the subcontractor no longer carries the protection your contract requires, and any losses that occur afterward may fall back on you or your own insurance.",
      },
      {
        title: "How to use it in Subcontract Agreements",
        content:
          "Requiring notice of cancellation ensures you are informed early, so you can pause work, request proof of reinstatement, or take other steps to protect the project and your own liability.",
      },
    ],
    icon: Bell,
  },
];

// Get term IDs in order for navigation
export const termIds = glossaryTerms.map((t) => t.id);

// Get term by ID
export function getTermById(id: DocPage): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.id === id);
}

// Get prev/next terms for navigation
export function getAdjacentTerms(id: DocPage): {
  prev: GlossaryTerm | null;
  next: GlossaryTerm | null;
} {
  const idx = termIds.indexOf(id);
  return {
    prev: idx > 0 ? glossaryTerms[idx - 1] : null,
    next: idx < termIds.length - 1 ? glossaryTerms[idx + 1] : null,
  };
}

// FAQ data
export const faqItems = [
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

// Downloads data
export const downloads = [
  {
    title: "Risk Transfer Checklist",
    description:
      "Helpful checklist to show what true compliance takes. Review insurance requirements, verify endorsements, and ensure proper risk transfer on every project.",
    cta: "Download PDF",
  },
  {
    title: "Understanding Midpoint",
    description:
      "A quick explanation of how Midpoint works and can save builders time and money. Learn about our automated COI analysis and compliance verification.",
    cta: "Download PDF",
  },
];

// Helper to create icon element
export function createIcon(IconComponent: typeof Shield, className?: string) {
  return createElement(IconComponent, { className: className || "w-5 h-5" });
}
