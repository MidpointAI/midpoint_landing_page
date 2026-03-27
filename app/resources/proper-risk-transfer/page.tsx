import { Metadata } from "next";
import { ProperRiskTransferContent } from "./content";

export const metadata: Metadata = {
  title: "Proper Risk Transfer | Midpoint",
  description:
    "Step-by-step guide to proper risk transfer for general contractors. Learn how sub-contracts, COIs, and endorsements work together to protect your business.",
  openGraph: {
    title: "Proper Risk Transfer — How It Works | Midpoint",
    description:
      "Ensure subcontractor insurance responds correctly with this step-by-step risk transfer guide.",
    type: "website",
  },
  alternates: {
    canonical: "/resources/proper-risk-transfer",
  },
};

export default function ProperRiskTransferPage() {
  return <ProperRiskTransferContent />;
}
