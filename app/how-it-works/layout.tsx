import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Managed Insurance Compliance | Midpoint",
  description:
    "See how Midpoint manages insurance compliance for GCs — from signed subcontract to requirements, collection, verification, and ongoing monitoring.",
  openGraph: {
    title: "How It Works | Managed Insurance Compliance",
    description:
      "Signed agreement becomes the compliance benchmark. Then we collect, verify, and monitor every COI and endorsement against that contract.",
    type: "website",
  },
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
