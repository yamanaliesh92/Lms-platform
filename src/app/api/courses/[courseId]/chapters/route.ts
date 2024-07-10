import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const chapterSchema = z.object({
  title: z.string().min(1, { message: "Title course is required" }),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const body = await req.json();

    const validation = chapterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format().title, {
        status: 400,
      });
    }

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    const courseOwner = await db.course.findUnique({
      where: { userId, id: courseId },
    });
    if (!courseOwner) {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
    const lastChapter = await db.chapter.findFirst({
      where: { courseId: courseId },
      orderBy: { position: "desc" },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const chapter = await db.chapter.create({
      data: {
        title: body.title,
        courseId,
        position: newPosition,
      },
    });
    return NextResponse.json(chapter);
  } catch (err) {
    console.log("[course]", err);

    return NextResponse.json("something went wrong", { status: 500 });
  }
}
