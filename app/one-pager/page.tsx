import { Metadata } from "next";
import OnePager from "@/components/one-pager";

export const metadata: Metadata = {
  title: "What is Midpoint? | One-Pager Overview",
  description:
    "Learn how Midpoint helps residential builders and general contractors manage subcontractor insurance compliance with AI-powered COI analysis.",
  openGraph: {
    title: "What is Midpoint? | One-Pager Overview",
    description:
      "Learn how Midpoint helps residential builders and general contractors manage subcontractor insurance compliance.",
    type: "article",
  },
  alternates: {
    canonical: "/one-pager",
  },
};

export default function OnePagerPage() {
  return <OnePager />;
}
