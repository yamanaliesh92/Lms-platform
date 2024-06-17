import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const user = await currentUser();
    if (!user || user.id || user.emailAddresses?.[0].emailAddress) {
      return NextResponse.json("Unaired", { status: 401 });
    }
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: "1",
          courseId,
        },
      },
    });

    if (purchase) {
      return NextResponse.json("already purchase", { status: 400 });
    }

    if (!course) {
      return NextResponse.json("Not Found", { status: 404 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId: "1" },
      select: { stripeCustomerId: true },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: "1",
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: courseId,
        userId: "1",
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.log("[Error_ID_CHECKOUT]", err);
    return NextResponse.json("internal server error", { status: 500 });
  }
}
