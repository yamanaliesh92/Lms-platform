import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as z from "zod";

const courseSchema = z.object({
  title: z.string().min(1, { message: "Title course is required" }),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const validation = courseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format().title, {
        status: 400,
      });
    }

    const save = await db.course.create({
      data: { userId, title: body.title },
    });
    return NextResponse.json(save);
  } catch (err) {
    console.log("[course]", err);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
