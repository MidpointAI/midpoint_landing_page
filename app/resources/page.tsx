"use client";

import { useState } from "react";
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
      {/* Hero Section */}
      <ResourcesHero />

      {/* Mobile Navigation */}
      <ResourcesMobileNav activePage={activePage} onNavigate={handleNavigate} />

      {/* Docs Body */}
      <div className="container-site">
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

    </div>
  );
}
