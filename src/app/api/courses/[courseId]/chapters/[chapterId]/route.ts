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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    //   const { userId } = auth();
    // if(!userId){return NextResponse.json("")}
    const { chapterId } = params;
    const { courseId } = params;

    const userId = "1";
    const ownerCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!ownerCourse) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId, courseId: params.courseId },
    });

    if (!chapter) {
      return NextResponse.json("chapter is not found", { status: 404 });
    }

    // chechk if the chapter has video so you have delete
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }
    }

    const deleteChapter = await db.chapter.delete({
      where: { id: params.chapterId },
    });
    // course not be published if it dont have at least oneChapter published

    const publishChaptersInCourse = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });
    if (!publishChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deleteChapter);
  } catch (err) {
    return NextResponse.json("soem thing wmetn", { status: 500 });
  }
}
