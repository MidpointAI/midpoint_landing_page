"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  HelpCircle,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { glossaryTerms, type DocPage } from "./resources-data";

interface ResourcesSidebarProps {
  activePage: DocPage;
  onNavigate: (page: DocPage) => void;
}

export function ResourcesSidebar({
  activePage,
  onNavigate,
}: ResourcesSidebarProps) {
  const [termsOpen, setTermsOpen] = useState(true);

  const handleNavigate = (page: DocPage) => {
    onNavigate(page);
    // Smooth scroll to content
    setTimeout(() => {
      const content = document.getElementById("resources-content");
      if (content) {
        content.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <aside className="hidden lg:flex w-60 xl:w-64 sticky top-0 h-svh flex-col py-8 pr-4">
      <nav className="flex flex-col flex-1">
        {/* Overview */}
        <NavItem
          icon={<BookOpen className="w-4 h-4" />}
          label="Overview"
          isActive={activePage === "overview"}
          onClick={() => handleNavigate("overview")}
        />

        {/* What is Midpoint? */}
        <NavItem
          icon={<Sparkles className="w-4 h-4" />}
          label="What is Midpoint?"
          isActive={activePage === "what-is-midpoint"}
          onClick={() => handleNavigate("what-is-midpoint")}
        />

        {/* Proper Risk Transfer */}
        <NavItem
          icon={<ShieldCheck className="w-4 h-4" />}
          label="Proper Risk Transfer"
          isActive={activePage === "proper-risk-transfer"}
          onClick={() => handleNavigate("proper-risk-transfer")}
        />

        {/* Insurance Terms collapsible */}
        <div className="mt-5">
          <button
            onClick={() => setTermsOpen(!termsOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs uppercase tracking-[0.08em] text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer font-medium"
          >
            <span>Insurance Terms</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                termsOpen ? "" : "-rotate-90"
              }`}
            />
          </button>

          {/* Terms list */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              termsOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-1 flex flex-col gap-1 mt-2">
              {glossaryTerms.map((term) => (
                <button
                  key={term.id}
                  onClick={() => handleNavigate(term.id)}
                  className={`
                    text-left px-3 py-2.5 rounded-lg text-sm border transition-all duration-200 cursor-pointer
                    ${
                      activePage === term.id
                        ? "bg-primary/10 border-primary/20 text-primary font-medium"
                        : "border-transparent text-muted-foreground/70 hover:text-primary"
                    }
                  `}
                >
                  {term.tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-border/20 my-5" />

        {/* Downloads */}
        <NavItem
          icon={<FileText className="w-4 h-4" />}
          label="Downloads"
          isActive={activePage === "downloads"}
          onClick={() => handleNavigate("downloads")}
        />

        {/* FAQ */}
        <NavItem
          icon={<HelpCircle className="w-4 h-4" />}
          label="FAQ"
          isActive={activePage === "faq"}
          onClick={() => handleNavigate("faq")}
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Help card */}
        <div className="rounded-xl border border-border/30 p-5 mt-4">
          <h4 className="text-base font-medium text-foreground mb-2">
            Need help?
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Our team is ready to answer your questions about insurance
            compliance.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline cursor-pointer"
          >
            Contact us
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>
    </aside>
  );
}

// Navigation item component
function NavItem({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-3 rounded-lg text-sm border transition-all duration-200 cursor-pointer
        ${
          isActive
            ? "bg-primary/10 border-primary/20 text-primary font-medium"
            : "border-transparent text-muted-foreground/70 hover:text-primary"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// Gradient divider component
export function GradientDivider() {
  return (
    <div className="hidden lg:block w-px">
      <div className="sticky top-0 h-svh bg-gradient-to-b from-transparent via-border/50 to-transparent" />
    </div>
  );
}
