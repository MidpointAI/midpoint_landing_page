/**
 * Customer proof for the home page and /customers. Every figure here was
 * traced to a meeting note or Slack thread (see the project memory
 * "midpoint-social-proof-sources"). Entries marked `pending` use neutral,
 * publishable copy; swap in the client's name and logo once they've approved it.
 */

export interface Stat {
  value: string;
  label: string;
  source: string;
  /** True until the named client has approved public use. */
  pending?: boolean;
}

export interface Logo {
  /** Path under /public. Transparent PNG or SVG; rendered as a CSS mask in the foreground colour. */
  src: string;
  /** width / height of the artwork, so the mask box matches it. */
  ratio: number;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  logo?: Logo;
  /** Optional proof line shown above the quote, e.g. a verified result. */
  highlight?: string;
}

// Client logos pulled from the Midpoint Platform Designs Figma file ("Logos" component).
export const LOGOS = {
  finerTouch: { src: "/customers/a-finer-touch.png", ratio: 1000 / 1013 },
  stonegate: { src: "/customers/stonegate.png", ratio: 396 / 64 },
  starwood: { src: "/customers/starwood.png", ratio: 228 / 136 },
} as const satisfies Record<string, Logo>;

export const stats: Stat[] = [
  {
    value: "$1M",
    label: "Uncovered subcontractor scope caught before work began. “Worth it within the second review.”",
    source: "$90M commercial project",
    pending: true, // TODO: name Digital Desert once approved
  },
  {
    value: "60%",
    label: "Rate reduction on one builder's trade partner coverage",
    source: "A Finer Touch Construction",
  },
  {
    value: "$300K",
    label: "Claim covered because agreements and certificates were in place",
    source: "Custom home builder",
    pending: true, // TODO: name Starwood Custom Homes once approved; confirm figure with Tyler
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Working with Midpoint has been a game-changer for us. Their approach has reduced time spent managing the compliance process as well as dramatically reducing our exposure and insurance premiums.",
    name: "Spencer Nield",
    title: "Director of Operations",
    company: "A Finer Touch Construction",
    logo: LOGOS.finerTouch,
    highlight: "60% rate reduction",
  },
  {
    quote:
      "Before signing on, we didn't have subcontractor agreements in place, and only about 10% of trade partners carried the required insurance. Now every trade partner has an executed agreement and we're sitting at 98% compliance. It's streamlined, accountable, and a big win for our risk management.",
    name: "Andy Becker",
    title: "Owner",
    company: "Stonegate Custom Homes",
    logo: LOGOS.stonegate,
  },
  {
    quote:
      "Since Midpoint has taken over and streamlined our compliance requirements, it has significantly reduced preparation time and stress during insurance audits and also our day to day tracking. I would definitely recommend this service to any company.",
    name: "Samantha Becher",
    title: "Office Manager",
    company: "Starwood Custom Homes",
    logo: LOGOS.starwood,
  },
];

/* ------------------------------------------------------------------------- */
/* Customer stories (/customers)                                              */
/* ------------------------------------------------------------------------- */

/** The three questions a builder asks before signing. Each story answers one. */
export type Outcome = "subs-respond" | "audit-and-claims" | "premium";

export const OUTCOME_LABEL: Record<Outcome, string> = {
  "subs-respond": "Will my subs actually respond?",
  "audit-and-claims": "Does it hold up in an audit or a claim?",
  premium: "What happens to my premium?",
};

export interface CustomerStory {
  id: string;
  /**
   * No story ships without written permission on file. `approved` is the
   * switch: false entries are kept here for the copy but rendered nowhere.
   */
  approved: boolean;
  company: string;
  location: string;
  scale: string;
  outcome: Outcome;
  /** The one story that gets the full-width treatment. */
  hero?: boolean;
  headline: string;
  problem: string;
  action: string;
  result: string;
  stat: { value: string; label: string };
  /** Which `testimonials` entry carries this client's quote. */
  testimonialName: string;
  logo?: Logo;
}

export const customerStories: CustomerStory[] = [
  {
    id: "a-finer-touch",
    approved: true,
    company: "A Finer Touch Construction",
    location: "Arizona", // TODO: confirm city with the client before adding it
    scale: "About 175 trade partners across 8 projects",
    outcome: "premium",
    hero: true,
    headline: "The premium followed the paperwork down.",
    problem:
      "A Finer Touch was already paying for a compliance tool. It tracked certificates, but the team still did the chasing, the reading, and the follow-up on every sub, and their own coverage was priced as if none of that work existed.",
    action:
      "Midpoint took over collection, verification, and follow-up for every trade partner on every active project, and held each one to the requirements in their signed agreement. When the roster was verified, we worked with their agent so the carrier could see it.",
    result:
      "Trade partner coverage was rated with the verified roster in hand. The rate came down by more than half, and the office stopped spending its week on certificates.",
    stat: { value: "60%", label: "rate reduction on trade partner coverage" },
    testimonialName: "Spencer Nield",
    logo: LOGOS.finerTouch,
  },
  {
    id: "stonegate",
    approved: true,
    company: "Stonegate Custom Homes",
    location: "Arizona",
    scale: "Custom home builder",
    outcome: "subs-respond",
    headline: "From a handful of certificates to a roster that answers.",
    problem:
      "Stonegate had no subcontractor agreements in place. Without a signed agreement there was nothing to hold a trade partner to, so most of the roster carried whatever coverage they happened to have.",
    action:
      "We put an executed agreement, with clear insurance requirements, behind every trade partner, then requested the certificates and endorsements those requirements called for. Every request went to the sub and to the agent who wrote their policy, with follow-up until it closed.",
    result:
      "In the owner's words, compliance went from about one in ten trade partners to nearly all of them, and each one now has an executed agreement on file.",
    stat: { value: "98%", label: "of trade partners compliant, per the owner" },
    testimonialName: "Andy Becker",
    logo: LOGOS.stonegate,
  },
  {
    id: "starwood",
    approved: true,
    company: "Starwood Custom Homes",
    location: "Arizona",
    scale: "About 200 trade partners",
    outcome: "audit-and-claims",
    headline: "Audit season stopped being a season.",
    problem:
      "With around 200 trade partners, every insurance audit meant days of pulling certificates, spotting the ones that had lapsed, and explaining the gaps. Day-to-day tracking took the same kind of time all year.",
    action:
      "Midpoint took over the requirements, the collection, and the ongoing tracking. Every certificate and endorsement is verified against the agreement and filed by project, so the records exist before anyone asks for them.",
    result:
      "Audit preparation dropped from days of scramble to handing over a file. The office manager says the stress went with it.",
    stat: { value: "200", label: "trade partners tracked, filed by project" },
    testimonialName: "Samantha Becher",
    logo: LOGOS.starwood,
  },

  /* ---- Pending permission. Rendered nowhere until `approved` flips. ---- */
  {
    id: "digital-desert",
    approved: false, // TODO: written permission from Digital Desert
    company: "Digital Desert",
    location: "Arizona",
    scale: "$90M commercial project",
    outcome: "audit-and-claims",
    headline: "A million dollars of uncovered scope, caught before the work began.",
    problem:
      "On a large commercial project, one subcontractor's policy excluded the very scope they were contracted to perform.",
    action:
      "Our review compared the endorsements on the certificate to the work in the agreement and flagged the exclusion before mobilization.",
    result: "The gap was closed before a claim could find it. “Worth it within the second review.”",
    stat: { value: "$1M", label: "of uncovered scope caught before work began" },
    testimonialName: "",
  },
  {
    id: "keystone",
    approved: false, // TODO: written permission from Keystone
    company: "Keystone",
    location: "Arizona",
    scale: "Custom home builder",
    outcome: "audit-and-claims",
    headline: "The auditor's list ended the day Midpoint started.",
    problem: "An insurer audit turned up eleven missing certificates.",
    action: "Every one of the eleven predated Midpoint. Everything after the handoff was compliant.",
    result: "The audit drew a clean line between before and after.",
    stat: { value: "11", label: "missing certificates, all from before Midpoint" },
    testimonialName: "",
  },
  {
    id: "dallas",
    approved: false, // TODO: written permission from Dallas Construction
    company: "Dallas Construction",
    location: "Arizona",
    scale: "General contractor",
    outcome: "subs-respond",
    headline: "Most of the roster answered inside a day.",
    problem: "A new roster, none of it verified, and a builder who doubted subs would reply at all.",
    action: "First-cycle outreach went to every sub and their agent with the exact requirements from the signed agreement.",
    result: "Thirteen or fourteen responses came back within 24 hours of the first request.",
    stat: { value: "24 hrs", label: "for the first wave of subs to respond" },
    testimonialName: "",
  },
];
