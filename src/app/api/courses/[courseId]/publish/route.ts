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
      include: {
        chapters: {
          include: {
            maxData: true,
          },
        },
      },
    });
    if (!course) {
      return NextResponse.json("not found", { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.imgUrl ||
      !course.description ||
      !hasPublishedChapter ||
      !course.categoryId
    ) {
      return NextResponse.json("Missing required filed", { status: 401 });
    }
    const publishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: true },
    });
    return NextResponse.json(publishedCourse);
  } catch (err) {
    console.log("error in published chapter", err);
    return NextResponse.json("some thing went wrong", { status: 500 });
  }
}
