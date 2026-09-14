import type { Metadata } from "next";
import LegalArticle, { type LegalSection } from "@/components/legal-article";

// TODO: have counsel review before publishing. Assumptions to confirm are
// listed in the commit message and at the bottom of this file.
const UPDATED = "September 8, 2026";
const CONTACT = "service@midpointverified.com";
const ADDRESS = "111 E Monroe Ave, Buckeye, AZ 85396";

export const metadata: Metadata = {
  title: "Privacy Policy | Midpoint",
  description: "How Midpoint collects, uses, and protects information from website visitors, clients, and the subcontractors whose insurance documents we review.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Who this policy covers",
    body: (
      <>
        <p>This policy explains how Midpoint (&ldquo;Midpoint,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) handles personal information in three situations: when you visit this website, when a general contractor or builder engages us to manage subcontractor insurance compliance, and when you are a subcontractor, insurance agent, or carrier whose documents reach us as part of that work.</p>
        <p>Where a client has engaged us to review documents on its behalf, we process those documents as the client&apos;s service provider under the terms of our agreement with that client. This policy describes our practices; it does not replace the client&apos;s own obligations to its trade partners.</p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p><strong className="text-foreground">From website visitors.</strong> If you use the contact form, we collect the name, email address, company, subject, and message you provide. Our hosting provider records standard server logs, including IP address, browser type, and the pages requested. We do not run advertising trackers on this site.</p>
        <p><strong className="text-foreground">From clients.</strong> Contact details for the people we work with, your project and subcontractor lists, executed subcontract agreements, and the insurance requirements those agreements set.</p>
        <p><strong className="text-foreground">From subcontractors, agents, and carriers.</strong> Certificates of insurance, policy endorsements, declarations pages, and related correspondence. These documents typically contain business names, policy numbers, coverage limits, effective dates, and the names and contact details of the people who send them.</p>
        <p><strong className="text-foreground">Stored in your browser.</strong> This site remembers your light or dark theme preference in your browser&apos;s local storage. That value never leaves your device and is not a tracking cookie.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    body: (
      <ul>
        <li>To respond to enquiries sent through the contact form.</li>
        <li>To perform the service: extracting insurance requirements from agreements, requesting and collecting documents, verifying coverage against those requirements, following up on gaps and expirations, and reporting results to the client.</li>
        <li>To communicate with subcontractors, agents, and carriers about documents that are missing, expiring, or non-compliant.</li>
        <li>To maintain records that support a client&apos;s risk transfer if a claim arises, including for a period after a project ends.</li>
        <li>To operate, secure, and improve the service and this website.</li>
        <li>To meet legal, regulatory, and insurance-industry obligations.</li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>We do not sell personal information. We share it only as needed to provide the service:</p>
        <ul>
          <li><strong className="text-foreground">Clients.</strong> Compliance status and the underlying documents for the subcontractors on their projects.</li>
          <li><strong className="text-foreground">Subcontractors, agents, and carriers.</strong> The requirements a subcontractor must meet and the status of their documents, so they can respond.</li>
          <li><strong className="text-foreground">Service providers</strong> that host our systems, deliver email, and store records. Contact-form submissions are delivered through an email service and recorded in a spreadsheet and a team messaging channel we operate.</li>
          <li><strong className="text-foreground">Insurance partners.</strong> Where a client has asked us to coordinate with its insurance broker or carrier, we share the information needed to do so.</li>
          <li><strong className="text-foreground">Legal.</strong> When required by law, court order, or to protect the rights and safety of Midpoint, our clients, or others.</li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>Insurance claims can arrive well after a project closes, and a client&apos;s risk transfer depends on being able to show what coverage was in force on the day of the work. For that reason we keep compliance records, including certificates and endorsements, for the life of the engagement and for at least two years after a project&apos;s completion, or longer if a client&apos;s agreement or applicable law requires it.</p>
        <p>Contact-form submissions are kept as long as needed to respond and for our business records. Server logs are kept for a limited period for security and troubleshooting.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>Documents are transmitted and stored using encrypted connections and access-controlled systems. Access is limited to the Midpoint team members who need it to perform the service. No method of transmission or storage is completely secure, and we cannot guarantee absolute security, but we take reasonable measures appropriate to the sensitivity of the information we handle.</p>
    ),
  },
  {
    id: "rights",
    title: "Your choices",
    body: (
      <>
        <p>You can ask us to tell you what personal information we hold about you, to correct it, or to delete it, subject to our obligations to clients and to retention requirements described above. Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we will respond within a reasonable time.</p>
        <p>If you are a subcontractor, agent, or carrier and would prefer to receive document requests through a different contact, tell us and we will update our records. Note that a client&apos;s contract may still require the underlying documents.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: <p>This website and service are intended for businesses and are not directed at children under 16. We do not knowingly collect personal information from children.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>We may update this policy as the service evolves. The date at the top shows the latest revision. Material changes will be noted on this page.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about this policy or our handling of your information: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>, or by mail at Midpoint, {ADDRESS}.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalArticle
      eyebrow="Legal"
      title="Privacy Policy"
      updated={UPDATED}
      intro="How Midpoint collects, uses, and protects information from website visitors, clients, and the subcontractors whose insurance documents we review."
      sections={sections}
    />
  );
}

/*
 * Assumptions for counsel to confirm:
 * - Legal entity name and jurisdiction (currently "Midpoint" with the Buckeye, AZ address).
 * - Retention period (two years post-project, matching the service's monitoring window).
 * - Service providers described generically (email delivery, spreadsheet, team messaging,
 *   hosting). Name them if required by applicable law.
 * - Whether any state privacy law (e.g. California) applies given client locations.
 */
