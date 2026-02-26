import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Insurance Terms & Compliance Guide | Midpoint",
  description:
    "Learn about insurance compliance terminology, COI requirements, and best practices for managing subcontractor insurance. Download helpful resources and guides.",
  openGraph: {
    title: "Resources | Insurance Terms & Compliance Guide",
    description:
      "Learn about insurance compliance terminology, COI requirements, and best practices for managing subcontractor insurance.",
    type: "website",
  },
  alternates: {
    canonical: "/resources",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
