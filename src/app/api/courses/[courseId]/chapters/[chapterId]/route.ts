import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    const { chapterId } = params;
    const { courseId } = params;
    const { isPublished, ...values } = await req.json();

    const ownerCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!ownerCourse) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { ...values },
    });

    return NextResponse.json(chapter);
  } catch (err) {
    return NextResponse.json("something went wrong", { status: 500 });
  }
}
