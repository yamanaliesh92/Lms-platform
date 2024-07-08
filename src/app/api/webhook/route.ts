import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json(`Webhook Error ${error.message}`, { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return NextResponse.json("Webhook Error:Missing metdata", {
        status: 400,
      });
    }
    await db.purchase.create({ data: { courseId, userId } });
  } else {
    return NextResponse.json(
      `Webhook Error:Unhandled event type ${event.type}`,
      { status: 200 }
    );
  }
  return NextResponse.json(null, { status: 200 });
}
