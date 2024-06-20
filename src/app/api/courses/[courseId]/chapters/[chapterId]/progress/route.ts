import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    const { chapterId, courseId } = params;

    const { isCompleted } = await req.json();

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: { userId, chapterId },
      },
      update: { isCompleted },

      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });
    return NextResponse.json(userProgress);
  } catch (err) {
    console.log("error in progress", err);
    return NextResponse.json("internal server error", { status: 500 });
  }
}
