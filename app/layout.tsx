import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Bebas_Neue, Instrument_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} ${instrumentSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
