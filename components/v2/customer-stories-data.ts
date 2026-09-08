/**
 * Customer proof for the home page. Every figure here was traced to a
 * meeting note or Slack thread (see the project memory "midpoint-social-
 * proof-sources"). Entries marked `pending` use neutral, publishable copy;
 * swap in the client's name and logo once they've approved it.
 */

export interface Stat {
  value: string;
  label: string;
  source: string;
  /** True until the named client has approved public use. */
  pending?: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  /** Path under /public. Only set this once the file exists; a missing file shows a broken image before hydration. */
  logo?: string;
  /** Optional proof line shown above the quote, e.g. a verified result. */
  highlight?: string;
}

export const stats: Stat[] = [
  {
    value: "$1M",
    label: "Uncovered subcontractor scope caught before work began. \u201cWorth it within the second review.\u201d",
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
    // logo: "/customers/a-finer-touch.svg", // TODO: uncomment once the file is in public/customers
    highlight: "60% rate reduction",
  },
  {
    quote:
      "Before signing on, we didn't have subcontractor agreements in place, and only about 10% of trade partners carried the required insurance. Now every trade partner has an executed agreement and we're sitting at 98% compliance. It's streamlined, accountable, and a big win for our risk management.",
    name: "Andy Becker",
    title: "Owner",
    company: "Stonegate Custom Homes",
    // logo: "/customers/stonegate.svg", // TODO: uncomment once the file is in public/customers
  },
  {
    quote:
      "Since Midpoint has taken over and streamlined our compliance requirements, it has significantly reduced preparation time and stress during insurance audits and also our day to day tracking. I would definitely recommend this service to any company.",
    name: "Samantha Becher",
    title: "Office Manager",
    company: "Starwood Custom Homes",
    // logo: "/customers/starwood.svg", // TODO: uncomment once the file is in public/customers
  },
];
