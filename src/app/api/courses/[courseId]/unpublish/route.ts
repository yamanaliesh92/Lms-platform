import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    const { courseId } = params;

    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return NextResponse.json("not found", { status: 404 });
    }

    const unPublishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: false },
    });
    return NextResponse.json(unPublishedCourse);
  } catch (err) {
    console.log("error in published chapter", err);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
