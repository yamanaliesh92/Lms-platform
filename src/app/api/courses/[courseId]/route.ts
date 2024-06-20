import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

import Mux from "@mux/mux-node";

const { video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET! as string
);

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

    const save = await db.course.update({
      where: { id: params.courseId, userId },
      data: { ...value },
    });
    return NextResponse.json(save);
  } catch (err) {
    console.log("[course]", err);

    return NextResponse.json("something went wrong", { status: 500 });
  }
}

export async function DELETE(
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
      where: { id: params.courseId, userId },
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

    for (const chapter of course.chapters) {
      if (chapter.maxData?.assetId) {
        await video.assets.delete(chapter.maxData.assetId);
      }
    }
    const deleteCourse = await db.course.delete({
      where: { id: courseId },
    });
    return NextResponse.json(deleteCourse);
  } catch (err) {
    console.log("[course]", err);

    return NextResponse.json("something went wrong", { status: 500 });
  }
}
