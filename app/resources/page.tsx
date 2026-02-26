"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ResourcesHero } from "@/components/resources/resources-hero";
import {
  ResourcesSidebar,
  GradientDivider,
} from "@/components/resources/resources-sidebar";
import { ResourcesMobileNav } from "@/components/resources/resources-mobile-nav";
import { ResourcesContent } from "@/components/resources/resources-content";
import { type DocPage } from "@/components/resources/resources-data";

export default function ResourcesPage() {
  const [activePage, setActivePage] = useState<DocPage>("overview");

  const handleNavigate = (page: DocPage) => {
    setActivePage(page);
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <ResourcesHero />

      {/* Mobile Navigation */}
      <ResourcesMobileNav activePage={activePage} onNavigate={handleNavigate} />

      {/* Docs Body */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 xl:px-12">
        <div className="flex">
          {/* Desktop Sidebar */}
          <ResourcesSidebar
            activePage={activePage}
            onNavigate={handleNavigate}
          />

          {/* Gradient Divider */}
          <GradientDivider />

          {/* Content */}
          <ResourcesContent
            activePage={activePage}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
