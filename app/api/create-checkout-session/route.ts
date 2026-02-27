import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      customerEmail,
      customerName,
      companyName,
      activeSubs,
      activeProjects,
    } = body;

    // Validate required fields
    if (!amount || amount < 600000) {
      // Minimum $6,000 = 600000 cents
      return NextResponse.json(
        { error: "Invalid amount. Minimum is $6,000." },
        { status: 400 }
      );
    }

    // Determine tier based on number of subs
    const subs = parseInt(activeSubs) || 0;
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
            unit_amount: amount, // Amount in cents
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
        annualPrice: (amount / 100).toFixed(2),
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
