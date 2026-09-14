import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Figtree, Geist } from "next/font/google";
import { Providers } from "@/components/providers";
import SiteChrome from "@/components/v2/site-chrome";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

const figtree = Figtree({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Midpoint — Insurance Compliance for GCs, Managed End to End",
  description:
    "A dedicated team plus software managing insurance compliance for general contractors — from signed agreement through requirements, collection, verification, and ongoing monitoring.",
  keywords: [
    "insurance compliance",
    "COI verification",
    "subcontractor insurance",
    "certificate of insurance",
    "construction insurance",
    "risk management",
    "general contractor compliance",
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
    title: "Midpoint — Insurance Compliance for GCs, Managed End to End",
    description:
      "A dedicated team plus software managing insurance compliance for general contractors — signed agreement to requirements, collection, verification, and monitoring.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Midpoint — Insurance compliance for GCs, managed end to end",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Midpoint — Insurance Compliance for GCs, Managed End to End",
    description:
      "A dedicated team plus software managing insurance compliance from signed agreement through ongoing monitoring.",
    images: ["/og-image.png"],
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
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${dmSans.variable} ${dmMono.variable} ${figtree.variable} bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
