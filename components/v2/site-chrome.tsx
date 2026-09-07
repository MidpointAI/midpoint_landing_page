"use client";

import { usePathname } from "next/navigation";
import NavbarV2 from "@/components/v2/navbar-v2";
import FooterV2 from "@/components/v2/footer-v2";

// Self-checkout is intentionally hidden. To bring it back, restore the
// QuoteModalV2 mount and the "Get a quote" entry points (see git history).
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/one-pager") {
    return <>{children}</>;
  }

  return (
    <>
      <NavbarV2 />
      {children}
      <FooterV2 />
    </>
  );
}
