"use client";

import { useState } from "react";
import { DocsHeader } from "@/components/docs-header";
import { DocsSidebar, type DocPage } from "@/components/docs-sidebar";
import { DocsContent } from "@/components/docs-content";

export default function ResourcesPage() {
  const [activePage, setActivePage] = useState<DocPage>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page: DocPage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    const content = document.querySelector("main");
    if (content) content.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-svh flex flex-col bg-background text-foreground overflow-hidden">
      <DocsHeader
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop sidebar */}
        <DocsSidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          className="hidden lg:flex lg:flex-col"
        />
        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <DocsSidebar
              activePage={activePage}
              onNavigate={handleNavigate}
              className="fixed inset-y-14 left-0 z-40 flex flex-col lg:hidden animate-slide-in-left"
            />
          </>
        )}
        {/* Main content */}
        <DocsContent activePage={activePage} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
