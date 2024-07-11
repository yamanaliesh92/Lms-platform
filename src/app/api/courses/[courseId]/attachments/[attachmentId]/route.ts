import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { courseId } = params;
    const { attachmentId } = params;

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!courseOwner) {
      return NextResponse.json("Forbidden", { status: 403 });
    }
    const attachment = await db.attachment.delete({
      where: { courseId, id: attachmentId },
    });
    return NextResponse.json(attachment);
  } catch (err) {
    console.log("[COURSE_ID_ATTACHMENTS]", err);

    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
