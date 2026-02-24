"use client";

import {
  BookOpen,
  Shield,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import { useState } from "react";

export type DocPage =
  | "overview"
  | "what-is-midpoint"
  | "general-liability"
  | "waiver-of-subrogation"
  | "primary-non-contributory"
  | "auto-liability"
  | "workers-comp"
  | "umbrella-coverage"
  | "additional-insured"
  | "notice-of-cancellation"
  | "resources"
  | "faq";

const glossaryItems: { id: DocPage; label: string }[] = [
  { id: "general-liability", label: "General Liability" },
  { id: "waiver-of-subrogation", label: "Waiver of Subrogation" },
  { id: "primary-non-contributory", label: "Primary & Non-Contributory" },
  { id: "auto-liability", label: "Auto Liability" },
  { id: "workers-comp", label: "Workers' Compensation" },
  { id: "umbrella-coverage", label: "Umbrella Coverage" },
  { id: "additional-insured", label: "Additional Insured" },
  { id: "notice-of-cancellation", label: "30-Day Notice" },
];

export function DocsSidebar({
  activePage,
  onNavigate,
  className,
}: {
  activePage: DocPage;
  onNavigate: (page: DocPage) => void;
  className?: string;
}) {
  const [glossaryOpen, setGlossaryOpen] = useState(true);

  return (
    <aside
      className={`w-64 xl:w-72 flex-shrink-0 border-r border-border/40 bg-background overflow-y-auto scrollbar-hide ${className ?? ""}`}
    >
      <nav className="py-6 px-4 flex flex-col gap-1" aria-label="Documentation navigation">
        <SidebarLink
          icon={<BookOpen className="w-4 h-4" />}
          label="Overview"
          active={activePage === "overview"}
          onClick={() => onNavigate("overview")}
        />

        <SidebarLink
          icon={<Info className="w-4 h-4" />}
          label="What is Midpoint?"
          active={activePage === "what-is-midpoint"}
          onClick={() => onNavigate("what-is-midpoint")}
        />

        <div className="mt-4">
          <button
            onClick={() => setGlossaryOpen(!glossaryOpen)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Insurance Terms</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${glossaryOpen ? "" : "-rotate-90"}`}
            />
          </button>

          {glossaryOpen && (
            <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-border/40 pl-3">
              {glossaryItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4">
          <SidebarLink
            icon={<FileText className="w-4 h-4" />}
            label="Resources"
            active={activePage === "resources"}
            onClick={() => onNavigate("resources")}
          />
        </div>

        <SidebarLink
          icon={<HelpCircle className="w-4 h-4" />}
          label="FAQ"
          active={activePage === "faq"}
          onClick={() => onNavigate("faq")}
        />

        <div className="mt-auto pt-8">
          <div className="mx-3 rounded-lg border border-border/40 bg-secondary/30 px-4 py-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[11px] font-medium text-foreground">8 terms available</span>
            </div>
            <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
              Comprehensive glossary for construction risk management.
            </p>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function SidebarLink({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 cursor-pointer ${
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      }`}
    >
      {icon}
      {label}
      {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
    </button>
  );
}
