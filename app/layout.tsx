import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Geist } from "next/font/google";
import { Providers } from "@/components/providers";
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

export const metadata: Metadata = {
  title: "Midpoint - AI-Powered Insurance Compliance for Builders",
  description:
    "Eliminate subcontractor paperwork with AI that reviews certificates and endorsements to uncover missing coverage, outdated limits, and hidden exposures.",
  keywords: [
    "insurance compliance",
    "COI verification",
    "subcontractor insurance",
    "certificate of insurance",
    "construction insurance",
    "risk management",
    "AI insurance",
  ],
  authors: [{ name: "Midpoint" }],
  creator: "Midpoint",
  publisher: "Midpoint",
  metadataBase: new URL("https://usemidpoint.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usemidpoint.com",
    siteName: "Midpoint",
    title: "Midpoint - AI-Powered Insurance Compliance for Builders",
    description:
      "Eliminate subcontractor paperwork with AI that reviews certificates and endorsements to uncover missing coverage, outdated limits, and hidden exposures.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Midpoint - AI-Powered Insurance Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Midpoint - AI-Powered Insurance Compliance for Builders",
    description:
      "Eliminate subcontractor paperwork with AI that reviews certificates and endorsements.",
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
        className={`${dmSans.variable} ${dmMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
