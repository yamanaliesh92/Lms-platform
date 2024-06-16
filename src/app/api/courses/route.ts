import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const save = await db.course.create({
      data: { userId, title },
    });
    return NextResponse.json(save);
  } catch (err) {
    console.log("[course]", err);

    return NextResponse.json("something went wrong", { status: 500 });
  }
}
