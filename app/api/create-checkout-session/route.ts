import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerEmail,
      customerName,
      companyName,
      activeSubs,
      activeProjects,
    } = body;

    const subs = Number.parseInt(activeSubs, 10) || 0;
    const projects = Number.parseInt(activeProjects, 10) || 0;
    const loadFactor = 1 + projects * 0.05;
    const calculatedAmount = Math.max(6000, 100 * subs * loadFactor);
    const amountInCents = Math.round(calculatedAmount * 100);

    // Validate required fields
    if (!customerEmail || !customerName || !companyName || subs <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid checkout fields." },
        { status: 400 }
      );
    }

    // Determine tier based on number of subs
    let tierName = "Essential";
    let tierSubtitle = "UP TO 25 ACTIVE SUBS";

    if (subs > 75) {
      tierName = "Premier";
      tierSubtitle = "100+ SUBS";
    } else if (subs > 25) {
      tierName = "Professional";
      tierSubtitle = "25-75 TRADES/SUBS";
    }

    // Create Checkout Session with custom ui_mode for embedded Payment Element
    const session = await stripe.checkout.sessions.create({
      ui_mode: "custom",
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Midpoint ${tierName} Plan - Annual Subscription`,
              description: `${tierSubtitle} | ${activeSubs} Active Subcontractors | ${activeProjects} Active Projects`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerName,
        companyName,
        activeSubs,
        activeProjects,
        tierName,
        annualPrice: calculatedAmount.toFixed(2),
      },
      return_url: `${request.headers.get("origin")}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
