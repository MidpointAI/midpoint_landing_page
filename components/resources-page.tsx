"use client";

import { useState } from "react";

// Glossary content data
const glossaryTerms = [
  {
    id: "general-liability",
    tab: "General Liability",
    title: "General Liability Coverage",
    description: "General Liability covers damage or injury caused by a subcontractor's work — things like water damage, faulty installation, or someone getting hurt because of their operations.",
    rightTitle: "Why it's required:",
    rightContent: "If a sub causes damage, you don't want the claim landing on your insurance. GL ensures the sub's policy responds first.",
    rightTitle2: "Why you want to be \"Additional Insured\":",
    rightContent2: "Being listed as Additional Insured means their policy must defend and cover you if their work triggers a claim. Without it, your insurance could be forced to pay even when the sub is responsible."
  },
  {
    id: "waiver-of-subrogation",
    tab: "Waiver of Subrogation",
    title: "Waiver of Subrogation",
    description: "",
    bullets: [
      "It prevents the subcontractor's insurer from coming after the general contractor if a subcontractor causes damage or injury, blocking action that could shift blame upstream.",
      "It aligns with standard risk transfer practices in construction by ensuring the party closest to the work bears the risk and the subcontractor's insurance is fully responsible for losses arising from their operations.",
      "It protects the general contractor's loss history and insurance costs by helping avoid unnecessary claims against the general contractor's policies that could affect future premiums."
    ],
    rightTitle: "In summary:",
    rightContent: "A waiver of subrogation is a provision where an insurer agrees that, after covering a loss for its policyholder, it will not seek repayment from any third party that may have contributed to the damage. This provision or endorsement can be applied to many coverages like general liability, workers compensation, and auto liability."
  },
  {
    id: "primary-non-contributory",
    tab: "Primary Non-Contributory",
    title: "Primary and Non-contributory Insurance",
    description: "\"Primary and noncontributory\" is a contractual insurance requirement that defines how multiple insurance policies must respond to the same loss. When a policy is required to be primary and noncontributory, it means the contractor's liability insurance must respond first, before any other applicable policies, and may not seek contribution from other policies that could also be considered primary.",
    rightTitle: "Primary Coverage:",
    rightContent: "This places full initial responsibility on the contractor's policy for covered losses. In other words, the contractor's liability insurance must respond first before any other applicable policies",
    rightTitle2: "Noncontributory Requirement:",
    rightContent2: "The contractor's policy may not seek contribution from other policies that could also be considered primary. This helps ensure other parties' insurance is not tapped for the same covered loss at the outset."
  },
  {
    id: "auto-liability",
    tab: "Auto Liability",
    title: "Auto Liability Coverage",
    description: "Auto Liability covers accidents caused by vehicles a subcontractor uses for work, trucks, vans, trailers, and equipment moved on public roads.",
    rightTitle: "Why it's required:",
    rightContent: "If a sub's vehicle injures someone or damages property while working on your project, you don't want that liability pushed back to you.",
    rightTitle2: "Why you want to be \"Additional Insured\":",
    rightContent2: "If a claim involves a vehicle being used for your jobsite or project, being Additional Insured ensures their Auto policy defends you, not yours."
  },
  {
    id: "workers-comp",
    tab: "Workers' comp",
    title: "Workers' Compensation",
    description: "Workers Comp pays medical bills and lost wages when a subcontractor's employee gets hurt while working.",
    rightTitle: "Why it's required:",
    rightContent: "If a sub doesn't carry Workers Comp, the injured worker can legally pursue you or the property owner for coverage. It protects you from those claims and ensures legal compliance."
  },
  {
    id: "umbrella-coverage",
    tab: "Umbrella Coverage",
    title: "Umbrella Coverage",
    description: "Umbrella insurance adds extra protection above a subcontractor's General Liability, Auto, and Workers Comp limits. It's for severe injuries, large fires, or major property damage.",
    rightTitle: "Why it's required:",
    rightContent: "High-severity losses can exceed basic limits quickly. Umbrella coverage ensures the subcontractor has enough financial protection to handle a catastrophic claim — instead of the GC getting pulled in.",
    rightTitle2: "Why you want to be \"Additional Insured\":",
    rightContent2: "Additional Insured status on the sub's Umbrella policy means you're protected even for large or high-dollar claims, keeping your own limits untouched."
  },
  {
    id: "additional-insured",
    tab: "Additional Insured",
    title: "Why \"Additional Insured\" Matters",
    description: "When a subcontractor adds you as an Additional Insured on their liability policies, it ensures:",
    bullets: [
      "Their insurance pays first, not yours",
      "You receive legal defense if you're named in a claim",
      "Your loss history stays clean, keeping your premiums lower",
      "You're protected from lawsuits related to the subcontractor's work",
      "You reduce risk transfer gaps that often cause claim disputes"
    ],
    rightTitle: "In summary:",
    rightContent: "Additional Insured status is what allows you to shift the risk of a subcontractor's work to their insurance—where it belongs."
  },
  {
    id: "notice-of-cancellation",
    tab: "30-Day Notice of Cancellation",
    title: "Notice of Cancellation",
    description: "A notice of cancellation is a formal alert from an insurance company stating that a subcontractor's policy will end on a certain date. The insurer must send this notice before the cancellation becomes effective, giving you time to address the issue.",
    rightTitle: "Why It Matters for General Contractors:",
    rightContent: "This notice is important because it tells you that a sub's insurance coverage is about to lapse or be terminated. That could be due to missed premium payments, underwriting issues, or other changes in the risk. Once the policy is canceled, the subcontractor no longer carries the protection your contract requires, and any losses that occur afterward may fall back on you or your own insurance.",
    rightTitle2: "How to Use It in Subcontract Agreements:",
    rightContent2: "Requiring notice of cancellation ensures you are informed early, so you can pause work, request proof of reinstatement, or take other steps to protect the project and your own liability."
  }
];

const faqItems = [
  {
    question: "How does Midpoint work?",
    answer: "Our team working with advanced tools analyze complex insurance policies. We scan documents instantly, identifying hidden risks and optimization opportunities. The result is a comprehensive risk management strategy tailored to protect you."
  },
  {
    question: "Can I save money?",
    answer: "Absolutely. Midpoint's intelligent system uncovers potential premium reductions by analyzing your current insurance coverage. We provide detailed recommendations that can significantly lower your financial burden."
  },
  {
    question: "Is my data secure?",
    answer: "Security is a top priority. We use bank-grade encryption and follow strict data protection protocols. Your sensitive information remains confidential and protected throughout our analysis process."
  },
  {
    question: "Who can use Midpoint?",
    answer: "Midpoint is designed specifically for residential home builders, general contractors, and subcontractors. Whether you're a small business or a large construction firm, our platform adapts to your unique insurance needs."
  },
  {
    question: "How quickly can I start?",
    answer: "Getting started is simple and fast. Our onboarding process takes minutes, not days. You'll have actionable insights into your insurance strategy within hours of initial setup."
  }
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("general-liability");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeGlossary = glossaryTerms.find(term => term.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section - Full Height */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34, 87, 46, 0.3) 0%, transparent 60%)"
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1
            className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            Risk management<br />resources
          </h1>
          <p
            className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Essential tools and insights to help builders navigate complex insurance landscapes and optimize risk transfer strategies
          </p>
        </div>
      </section>

      {/* Glossary Section - Full Height */}
      <section className="min-h-screen flex flex-col py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#c9ff64] text-sm font-medium mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              GLOSSARY
            </div>
            <h2
              className="text-white text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              Insurance terms <span className="text-[#c9ff64] italic">decoded</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Navigate complex insurance language with confidence. Our comprehensive glossary breaks down technical terms for residential home builders.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 border-b border-gray-800 pb-4">
            {glossaryTerms.map((term) => (
              <button
                key={term.id}
                onClick={() => setActiveTab(term.id)}
                className={`text-sm md:text-base pb-2 transition-all whitespace-nowrap ${
                  activeTab === term.id
                    ? "text-[#c9ff64] border-b-2 border-[#c9ff64]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {term.tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeGlossary && (
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {/* Left Column */}
              <div>
                <h3
                  className="text-white text-2xl md:text-3xl font-bold mb-6"
                  style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                >
                  {activeGlossary.title}
                </h3>
                {activeGlossary.description && (
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                    {activeGlossary.description}
                  </p>
                )}
                {activeGlossary.bullets && (
                  <ul className="space-y-4">
                    {activeGlossary.bullets.map((bullet, index) => (
                      <li key={index} className="flex gap-3 text-gray-300">
                        <span className="text-[#c9ff64] mt-1.5">●</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Right Column with lime border */}
              <div className="border-l-2 border-[#c9ff64] pl-8">
                <h4 className="text-[#c9ff64] text-lg font-semibold mb-4">
                  {activeGlossary.rightTitle}
                </h4>
                <p className="text-gray-300 leading-relaxed mb-8">
                  {activeGlossary.rightContent}
                </p>
                {activeGlossary.rightTitle2 && (
                  <>
                    <h4 className="text-[#c9ff64] text-lg font-semibold mb-4">
                      {activeGlossary.rightTitle2}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {activeGlossary.rightContent2}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Helpful Resources Section */}
      <section
        className="py-24 px-6 md:px-20"
        style={{
          background: "linear-gradient(180deg, rgba(34, 87, 46, 0.15) 0%, rgba(10, 10, 10, 1) 100%)"
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-white text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            Helpful Resources
          </h2>
          <p className="text-gray-400 mb-12">
            Real stories from contractors who transformed their risk management
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Risk Transfer Checklist Card */}
            <div className="bg-[#1a1a19] rounded-2xl p-8 text-center">
              <h3 className="text-white text-xl font-semibold mb-3">
                Risk Transfer Checklist
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Helpful check list of to show what true compliance takes.
              </p>
              <button className="inline-flex items-center gap-2 bg-[#c9ff64] text-black px-6 py-3 rounded-full font-medium hover:bg-[#b8ee53] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </button>
            </div>

            {/* Understanding Midpoint Card */}
            <div className="bg-[#1a1a19] rounded-2xl p-8 text-center">
              <h3 className="text-white text-xl font-semibold mb-3">
                Understanding Midpoint
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                A quick explanation of how Midpoint works and can save builders time and money.
              </p>
              <button className="inline-flex items-center gap-2 bg-[#c9ff64] text-black px-6 py-3 rounded-full font-medium hover:bg-[#b8ee53] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-20 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-white text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              Common Questions
            </h2>
            <p className="text-gray-400">
              Get clarity on how Midpoint transforms insurance management for residential contractors.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-800"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between py-6 text-left"
                >
                  <span className="text-white text-lg font-medium pr-4">
                    {item.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="pb-6">
                    <p className="text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 pt-12 border-t border-gray-800">
            <h3 className="text-white text-2xl font-bold mb-4">
              Need more information?
            </h3>
            <p className="text-gray-400 mb-8">
              Our team is ready to answer your specific questions and concerns.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="bg-[#c9ff64] text-black px-8 py-3 rounded-full font-medium hover:bg-[#b8ee53] transition-colors">
                Contact Us
              </button>
              <button className="text-white hover:text-[#c9ff64] transition-colors flex items-center gap-2">
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
