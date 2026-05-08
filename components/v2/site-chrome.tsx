"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import NavbarV2 from "@/components/v2/navbar-v2";
import QuoteModalV2 from "@/components/v2/quote-modal-v2";

const QuoteModalContext = createContext<{ openQuote: () => void }>({
  openQuote: () => {},
});

export function useQuoteModal() {
  return useContext(QuoteModalContext);
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showQuote, setShowQuote] = useState(false);
  const openQuote = useCallback(() => setShowQuote(true), []);
  const closeQuote = useCallback(() => setShowQuote(false), []);

  if (pathname === "/one-pager") {
    return <>{children}</>;
  }

  return (
    <QuoteModalContext.Provider value={{ openQuote }}>
      <NavbarV2 onQuoteClick={openQuote} />
      {children}
      {showQuote && <QuoteModalV2 onClose={closeQuote} />}
    </QuoteModalContext.Provider>
  );
}
