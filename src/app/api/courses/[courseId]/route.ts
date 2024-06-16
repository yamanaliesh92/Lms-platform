import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    const value = await req.json();

    const course = await db.course.update({
      where: { id: params.courseId, userId },
      data: { ...value },
    });
    return NextResponse.json(course);
  } catch (err) {
    console.log("[course]", err);

    return NextResponse.json("something went wrong", { status: 500 });
  }
}
