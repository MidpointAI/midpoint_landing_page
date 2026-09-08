import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Midpoint",
  description:
    "Sign the sub, CC Midpoint, and go back to building. We collect certificates, verify endorsements, flag gaps, and monitor expirations for every trade partner.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
