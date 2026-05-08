import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const PROJECT_VALUE_LABELS: Record<string, string> = {
  under750k: "Under $750K",
  "750k-2m": "$750K – $2M",
  "2m-5m": "$2M – $5M",
  "5mplus": "$5M+",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerEmail,
      customerName,
      companyName,
      activeSubs,
      activeProjects,
      projectValueRange,
      phone,
      address,
      city,
      state,
      zip,
    } = body;

    const subs = Number.parseInt(activeSubs, 10) || 0;

    if (!customerEmail || !customerName || !companyName || subs <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid checkout fields." },
        { status: 400 }
      );
    }

    let calculatedAmount: number;
    if (subs <= 25) calculatedAmount = 6000;
    else if (subs <= 100) calculatedAmount = subs * 125;
    else calculatedAmount = subs * 150;
    const amountInCents = Math.round(calculatedAmount * 100);

    let tierName = "Essential";
    let tierSubtitle = "UP TO 25 ACTIVE SUBS";
    if (subs > 100) {
      tierName = "Premier";
      tierSubtitle = "100+ ACTIVE SUBS";
    } else if (subs > 25) {
      tierName = "Professional";
      tierSubtitle = "26-100 ACTIVE SUBS";
    }

    const projectValueLabel =
      (projectValueRange && PROJECT_VALUE_LABELS[projectValueRange]) || "—";

    const metadata: Record<string, string> = {
      customerName,
      companyName,
      activeSubs: String(activeSubs ?? ""),
      activeProjects: String(activeProjects ?? ""),
      projectValueRange: projectValueRange ?? "",
      projectValueLabel,
      tierName,
      annualPrice: calculatedAmount.toFixed(2),
    };
    if (phone) metadata.phone = String(phone);
    if (address) metadata.address = String(address);
    if (city) metadata.city = String(city);
    if (state) metadata.state = String(state);
    if (zip) metadata.zip = String(zip);

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
              description: `${tierSubtitle} | ${activeSubs} Active Subs | ${activeProjects || 0} Active Projects | Avg Project Size: ${projectValueLabel}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata,
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
