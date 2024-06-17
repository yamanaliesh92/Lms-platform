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
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    const muxData = await db.muxData.findUnique({
      where: { chapterId },
    });

    if (
      !chapter ||
      !chapter.description ||
      !chapter.title ||
      !chapter.videoUrl ||
      !muxData
    ) {
      return NextResponse.json("Missing required filed ", { status: 400 });
    }

    const publishChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: true },
    });
    return NextResponse.json(publishChapter);
  } catch (err) {
    console.log("error in publish", err);
    return NextResponse.json("internal server error", { status: 500 });
  }
}
