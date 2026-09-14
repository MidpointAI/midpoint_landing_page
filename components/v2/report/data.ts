/**
 * Invented subcontractors and projects for the site's reporting graphics.
 * Nothing here is a real client. Keep names plausible but fictional.
 */

export type SubStatus = "collecting" | "reviewing" | "compliant" | "noncompliant" | "expiring";

export const STATUS_LABEL: Record<SubStatus, string> = {
  collecting: "Collecting",
  reviewing: "Reviewing",
  compliant: "Compliant",
  noncompliant: "Not compliant",
  expiring: "Expiring",
};

export type EvidenceCheck = { label: string; ok: boolean; note?: string };

export type Sub = {
  id: string;
  name: string;
  trade: string;
  project: string;
  status: SubStatus;
  /** 0–100 compliance score against the project's requirements. */
  score: number;
  evidence: EvidenceCheck[];
  /** Days since Midpoint reviewed this sub. Rendered relative so it never goes stale. */
  reviewedDaysAgo?: number;
};

const ok = (label: string): EvidenceCheck => ({ label, ok: true });
const flag = (label: string, note: string): EvidenceCheck => ({ label, ok: false, note });

export const PROJECT = { name: "North Ridge, Lot 14", location: "Cave Creek, AZ" };

export const SUBS: Sub[] = [
  {
    id: "saguaro",
    name: "Saguaro Electric",
    trade: "Electrical",
    project: PROJECT.name,
    status: "compliant",
    score: 100,
    reviewedDaysAgo: 5,
    evidence: [ok("General liability $1M / $2M"), ok("Additional insured, ongoing + completed"), ok("Primary and non-contributory"), ok("Waiver of subrogation"), ok("30-day cancellation notice")],
  },
  {
    id: "copper-ridge",
    name: "Copper Ridge Framing",
    trade: "Framing",
    project: PROJECT.name,
    status: "compliant",
    score: 100,
    reviewedDaysAgo: 5,
    evidence: [ok("General liability $1M / $2M"), ok("Additional insured, ongoing + completed"), ok("Primary and non-contributory"), ok("Waiver of subrogation"), ok("Workers' comp, statutory")],
  },
  {
    id: "mesa-verde",
    name: "Mesa Verde Plumbing",
    trade: "Plumbing",
    project: PROJECT.name,
    status: "compliant",
    score: 100,
    reviewedDaysAgo: 4,
    evidence: [ok("General liability $1M / $2M"), ok("Additional insured, ongoing + completed"), ok("Auto liability $1M CSL"), ok("Waiver of subrogation"), ok("30-day cancellation notice")],
  },
  {
    id: "ironwood",
    name: "Ironwood Concrete",
    trade: "Concrete",
    project: PROJECT.name,
    status: "compliant",
    score: 100,
    reviewedDaysAgo: 4,
    evidence: [ok("General liability $1M / $2M"), ok("Additional insured, ongoing + completed"), ok("Primary and non-contributory"), ok("Umbrella $5M"), ok("Workers' comp, statutory")],
  },
  {
    id: "bluebird",
    name: "Bluebird Roofing",
    trade: "Roofing",
    project: PROJECT.name,
    status: "compliant",
    score: 100,
    reviewedDaysAgo: 3,
    evidence: [ok("General liability $1M / $2M"), ok("Additional insured, ongoing + completed"), ok("Primary and non-contributory"), ok("Waiver of subrogation"), ok("Workers' comp, statutory")],
  },
  {
    id: "redrock",
    name: "Redrock Drywall",
    trade: "Drywall",
    project: PROJECT.name,
    status: "noncompliant",
    score: 80,
    reviewedDaysAgo: 3,
    evidence: [ok("General liability $1M / $2M"), ok("Additional insured, ongoing + completed"), ok("Primary and non-contributory"), ok("Waiver of subrogation"), flag("30-day cancellation notice", "Requested from the agent, 2 days ago")],
  },
];

/** "today", "yesterday", "5 days ago". */
export const formatDaysAgo = (n: number) => (n <= 0 ? "today" : n === 1 ? "yesterday" : `${n} days ago`);

/** Project-level score: the average of its subs. */
export const projectScore = (subs: Pick<Sub, "score">[]) =>
  Math.round(subs.reduce((t, s) => t + s.score, 0) / Math.max(1, subs.length));
