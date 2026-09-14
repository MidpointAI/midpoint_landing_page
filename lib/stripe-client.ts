import type { Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Lazily load Stripe.js. Nothing is fetched, and no script tag is injected,
 * until the first call — which should only happen at the payment step.
 * Returns null when the publishable key isn't configured so callers can
 * show a friendly message instead of throwing on every page load.
 */
export function getStripe(): Promise<Stripe | null> | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  if (!stripePromise) {
    // Dynamic import: the default @stripe/stripe-js entry injects Stripe.js
    // as a side effect of being imported, so keep it out of the page bundle.
    stripePromise = import("@stripe/stripe-js").then(({ loadStripe }) => loadStripe(key));
  }
  return stripePromise;
}
