import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers | Midpoint",
  description:
    "Builders who handed subcontractor insurance compliance to Midpoint: what they were dealing with, what we took over, and what changed in their roster, their audits, and their premium.",
  alternates: { canonical: "/customers" },
};

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
