import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import SiteChrome from "@/components/v2/site-chrome";
import "./globals.css";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Midpoint - Subcontractor Insurance Compliance for Builders",
  description:
    "Our compliance team collects, verifies, and monitors every subcontractor's certificates and endorsements, and flags missing coverage, outdated limits, and hidden exposures before they cost you.",
  keywords: [
    "insurance compliance",
    "COI verification",
    "subcontractor insurance",
    "certificate of insurance",
    "construction insurance",
    "risk management",
    "subcontractor compliance",
  ],
  authors: [{ name: "Midpoint" }],
  creator: "Midpoint",
  publisher: "Midpoint",
  metadataBase: new URL("https://midpointverified.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://midpointverified.com",
    siteName: "Midpoint",
    title: "Midpoint - Subcontractor Insurance Compliance for Builders",
    description:
      "Our compliance team collects, verifies, and monitors every subcontractor's certificates and endorsements, and flags missing coverage, outdated limits, and hidden exposures before they cost you.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Midpoint - Subcontractor Insurance Compliance for Builders",
    description:
      "Our compliance team collects, verifies, and monitors every subcontractor's certificates and endorsements.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#090c09" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body
        className={cn(dmSans.variable, dmMono.variable, "bg-background font-sans text-foreground antialiased")}
      >
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
