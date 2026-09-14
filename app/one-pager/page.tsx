import { Metadata } from "next";
import OnePager from "@/components/one-pager";

export const metadata: Metadata = {
  title: "What is Midpoint? | One-Pager Overview",
  description:
    "Learn how Midpoint’s managed compliance team helps general contractors handle insurance from signed agreement through collection, verification, and monitoring.",
  openGraph: {
    title: "What is Midpoint? | One-Pager Overview",
    description:
      "A dedicated team plus software managing insurance compliance for general contractors.",
    type: "article",
  },
  alternates: {
    canonical: "/one-pager",
  },
};

export default function OnePagerPage() {
  return <OnePager />;
}
