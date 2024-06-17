import { redirect } from "next/navigation";
import React from "react";
import { getProgress } from "../../../../../actions/get-progress";
import CourseNavbar from "./_components/course-navbar";
import CourseSidebar from "./_components/course-sidebar";
import { db } from "@/lib/db";

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  // const {userId}=auth()
  // if(!userid){return redirect("/")}
  const userId = "1";

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        include: { userProgress: { where: { userId } } },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }
  //   get progress for each chapter
  const progressCount = await getProgress(userId, course.id);
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 z-50 w-full">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
}