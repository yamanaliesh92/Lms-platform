import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    const { chapterId, courseId } = params;

    const ownerChapter = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!ownerChapter) {
      return NextResponse.json("Forbidden", { status: 403 });
    }
    const unPublishChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: false },
    });

    const publishChapterInCourse = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });

    if (!publishChapterInCourse.length) {
      const publishChapterInCourse = await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(unPublishChapter);
  } catch (err) {
    console.log("error in publish", err);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
