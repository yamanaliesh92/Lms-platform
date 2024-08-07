import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { url } = await req.json();
    const { courseId } = params;

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return NextResponse.json("Forbidden", { status: 403 });
    }

    const attachment = await db.attachment.create({
      data: { url, name: url.split("/").pop(), courseId },
    });
    return NextResponse.json(attachment);
  } catch (err) {
    console.log("[COURSE_ID_ATTACHMENTS]", err);

    return NextResponse.json("something went wrong", { status: 500 });
  }
}
