"use client";

import { ArrowRightIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useQuoteModal } from "@/components/v2/site-chrome";

export default function FinalCta() {
  const { openQuote } = useQuoteModal();

  return (
    <section className="w-full px-4 md:px-6 py-20 text-center bg-zinc-950">
      <h2
        className="text-4xl font-bold text-white mb-4 tracking-tight"
        style={{ fontFamily: "var(--font-display), sans-serif" }}
      >
        Ready to stop collecting COIs?
      </h2>
      <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
        Get a custom quote in under 60 seconds. No sales call required.
      </p>
      <Button size="lg" onClick={openQuote} className="gap-2 text-base px-10">
        Get a Quote Now <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </section>
  );
}
