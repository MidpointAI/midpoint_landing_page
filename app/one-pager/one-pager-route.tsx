"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRightIcon, FileTextIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { OnePagerOverlay } from "@/components/one-pager-overlay";

const noop = () => () => {};

/**
 * /one-pager opens the overlay as soon as the page mounts, so a shared link
 * lands on the sheet. Dismissing it leaves a small page with a way to reopen.
 */
export default function OnePagerRoute() {
  // The overlay portals into document.body, so it waits for the client.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <main className="min-h-[70vh] bg-background text-foreground">
      <PageHeader
        eyebrow="One-pager"
        title="Understanding Midpoint"
        description="How Midpoint handles subcontractor insurance compliance for builders, on one sheet."
      />
      <div className="container-site pb-20 md:pb-28 flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={() => setDismissed(false)}>
          <FileTextIcon />
          Open the one-pager
        </Button>
        <Button variant="link" asChild>
          <Link href="/resources">
            More resources <ArrowRightIcon />
          </Link>
        </Button>
      </div>
      <OnePagerOverlay open={mounted && !dismissed} onClose={() => setDismissed(true)} />
    </main>
  );
}
