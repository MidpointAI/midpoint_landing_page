"use client";

import { glossaryTerms, type DocPage } from "./resources-data";

interface ResourcesMobileNavProps {
  activePage: DocPage;
  onNavigate: (page: DocPage) => void;
}

// All navigation items for mobile
const navItems: { id: DocPage; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "what-is-midpoint", label: "What is Midpoint?" },
  { id: "proper-risk-transfer", label: "Proper Risk Transfer" },
  ...glossaryTerms.map((t) => ({ id: t.id, label: t.tab })),
  { id: "downloads", label: "Downloads" },
  { id: "faq", label: "FAQ" },
];

export function ResourcesMobileNav({
  activePage,
  onNavigate,
}: ResourcesMobileNavProps) {
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
    <div className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`
                px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer
                ${
                  activePage === item.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
