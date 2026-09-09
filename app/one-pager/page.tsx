import { Metadata } from "next";
import OnePagerRoute from "./one-pager-route";

export const metadata: Metadata = {
  title: "What is Midpoint? | One-Pager Overview",
  description:
    "Learn how Midpoint helps residential builders and general contractors manage subcontractor insurance compliance.",
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
  return <OnePagerRoute />;
}
