import { stripe } from "@/lib/stripe";

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (purchase) {
      return NextResponse.json("this course already purchase", { status: 400 });
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

    const customer = await stripe.customers.create({
      email: "alyamanaliesh@gmail.com",
    });

    let stripeCustomer = await db.stripeCustomer.upsert({
      where: {
        userId,
      },
      create: {
        stripeCustomerId: customer.id,
        userId: "user_2iuayzQVpZFp5ZPllGsGY25zTIm",
      },
      update: { updatedAt: new Date() },
      select: { stripeCustomerId: true },
    });

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: courseId,
        userId,
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.log("[Error_ID_CHECKOUT]", err);
    return NextResponse.json("internal server error", { status: 500 });
  }
}
