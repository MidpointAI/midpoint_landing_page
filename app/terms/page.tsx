import type { Metadata } from "next";
import LegalArticle, { type LegalSection } from "@/components/legal-article";

// TODO: have counsel review before publishing. Assumptions listed at the bottom of this file.
const UPDATED = "September 8, 2026";
const CONTACT = "service@midpointverified.com";

export const metadata: Metadata = {
  title: "Terms of Service | Midpoint",
  description: "The terms that govern use of the Midpoint website and the relationship between website terms and client service agreements.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "What these terms cover",
    body: (
      <>
        <p>These terms govern your use of the Midpoint website at midpointverified.com and the information on it. By using the site you agree to them.</p>
        <p>Midpoint&apos;s compliance service itself is provided to clients under a separate written agreement. If you are a client, that agreement governs the service, and if anything here conflicts with it, the client agreement controls.</p>
      </>
    ),
  },
  {
    id: "service",
    title: "About the service",
    body: (
      <>
        <p>Midpoint manages subcontractor insurance compliance for general contractors and builders. We collect certificates of insurance and policy endorsements, verify them against the requirements in a client&apos;s subcontract agreements, follow up on gaps and expirations, and report the results.</p>
        <p>Our review identifies whether submitted documents meet a client&apos;s stated requirements. It is not legal advice, not insurance advice, and not a guarantee that any policy will respond to a particular claim. Decisions about whether to accept an exception, hold a payment, restrict site access, or replace a subcontractor remain the client&apos;s.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "Using the site",
    body: (
      <>
        <p>You may use the site for lawful purposes connected with learning about or contacting Midpoint. You agree not to:</p>
        <ul>
          <li>Attempt to gain unauthorized access to any part of the site or the systems behind it.</li>
          <li>Use automated tools to scrape or copy the site&apos;s content, other than search engines indexing public pages.</li>
          <li>Submit false, misleading, or malicious content through the contact form.</li>
          <li>Interfere with the site&apos;s operation or with other visitors&apos; use of it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "content",
    title: "Content and intellectual property",
    body: (
      <>
        <p>The site&apos;s text, design, graphics, and code are owned by Midpoint or its licensors. You may view and print pages for your own reference. You may not reproduce or redistribute them commercially without permission.</p>
        <p>The resources section, including the insurance glossary and the risk transfer guide, is general educational material. It describes common practice in construction insurance and is not advice about your specific contracts, policies, or situation. Consult your broker, carrier, or attorney before relying on it.</p>
      </>
    ),
  },
  {
    id: "testimonials",
    title: "Customer stories and results",
    body: <p>Quotes and results shown on the site are from real clients and real engagements, shared with their permission. They reflect those clients&apos; experience. Results depend on a client&apos;s contracts, trade partners, and circumstances, and are not a promise of the same outcome for others.</p>,
  },
  {
    id: "third-party",
    title: "Third-party links and services",
    body: <p>The site may link to other websites or rely on third-party services to deliver email or host content. We are not responsible for the content or practices of third parties. Their terms and privacy policies apply to your use of their services.</p>,
  },
  {
    id: "warranty",
    title: "No warranty",
    body: <p>The site is provided &ldquo;as is.&rdquo; We aim to keep it accurate and available but do not warrant that it will be error-free, uninterrupted, or that the information on it is complete or current. To the fullest extent permitted by law, we disclaim all warranties, express or implied, regarding the site.</p>,
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: <p>To the fullest extent permitted by law, Midpoint will not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the site, and our total liability for any claim relating to the site is limited to one hundred US dollars. This section does not limit liability that cannot be limited by law, and it does not apply to the service provided under a client agreement, which has its own terms.</p>,
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of the State of Arizona, without regard to its conflict-of-law rules. Any dispute relating to the site will be brought in the state or federal courts located in Maricopa County, Arizona, and you consent to their jurisdiction.</p>,
  },
  {
    id: "changes",
    title: "Changes",
    body: <p>We may revise these terms from time to time. The date at the top shows the latest revision. Continued use of the site after a change means you accept the revised terms.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalArticle
      eyebrow="Legal"
      title="Terms of Service"
      updated={UPDATED}
      intro="The terms that govern use of this website, and how they relate to the agreements that govern the service itself."
      sections={sections}
    />
  );
}

/*
 * Assumptions for counsel to confirm:
 * - Legal entity name; governing law and venue (Arizona / Maricopa County, from the office address).
 * - Liability cap amount for website use ($100).
 * - That client engagements are always under a separate written agreement.
 * - Whether a separate Data Processing Agreement is offered (the old footer listed "DPA").
 */
