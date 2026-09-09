"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader
        eyebrow="Resources"
        title="Insurance terms"
        description="Essential knowledge to help builders navigate complex insurance landscapes and optimize risk transfer strategies."
      />

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
