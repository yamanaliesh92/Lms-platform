import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    const { list } = await req.json();

    console.log("REs", db.user.create);
    const courseOwner = await db.course.findUnique({
      where: { userId, id: courseId },
    });
    if (!courseOwner) {
      return NextResponse.json("something went wrong", { status: 500 });
    }

    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return NextResponse.json("Success", { status: 200 });
  } catch (err) {
    console.log("[course]", err);

    return NextResponse.json("soem thing wmetn", { status: 500 });
  }
}
