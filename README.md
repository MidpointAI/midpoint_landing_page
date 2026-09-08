# Midpoint website

Marketing site for [Midpoint](https://midpointverified.com), insurance verification for builders and general contractors.

Built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, and Framer Motion. Deployed as a standalone container to Google Cloud Run.

## Develop

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

Other scripts:

```bash
npm run build   # production build (standalone output)
npm run start   # serve the production build
npm run lint    # eslint
npx tsc --noEmit
```

## Structure

- `app/` — routes. Home, `/contact`, `/resources`, `/resources/proper-risk-transfer`, `/pricing/how-it-works`, `/one-pager`, plus API routes for the contact form and Stripe.
- `components/v2/` — the current design: site chrome (navbar, footer), home sections, brand logo.
- `components/resources/` — the resources hub (glossary, guide, downloads, FAQ).
- `components/ui/` — form primitives used by the contact page.
- `app/globals.css` — design tokens. All colours derive from the theme variables; the accent green is anchored to `--accent-hue`. Page layout uses the `container-site`, `container-prose`, and `section-y` utilities defined there.

Light and dark themes are handled by `next-themes`; the switcher lives in the footer. Dark is the default.

### Self-checkout (hidden)

The quote wizard and Stripe checkout (`components/v2/quote-modal-v2.tsx`, `lib/stripe-client.ts`, and the `app/api/*checkout*` routes) are intentionally not mounted. To re-enable, restore the modal mount in `components/v2/site-chrome.tsx` and add a button that opens it.

## Environment variables

| Variable | Used by |
| --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Contact form (client, build-time) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID` | Contact API route (writes submissions to a sheet) |
| `SLACK_WEBHOOK_URL` | Contact API route (notification) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe checkout (currently hidden) |

`NEXT_PUBLIC_*` values are baked in at build time; see the `ARG`s in the `Dockerfile`.

## Deploy

Pushes to `main` run type-check and lint, build the Docker image, push it to Artifact Registry, and deploy to Cloud Run (`.github/workflows/ci.yml`). Pull requests run the checks only.
