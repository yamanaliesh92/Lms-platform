import { db } from "@/lib/db";
import { redirect } from "next/navigation";

// i create a new orgnaztion outside dash beacuse i wnat when client watch the course dont have sidebar or navbar

// this compoent when click watch course always open first chapter automicatlly
export default async function page({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: { where: { isPublished: true }, orderBy: { position: "asc" } },
    },
  });
  if (!course) {
    return redirect("/");
  }
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}
