import { db } from "@/lib/db";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import CourseProgress from "./course-progress";
import CourseSidebarItem from "./Course-sidebar-item";
import { redirect } from "next/navigation";
import { ArrowBigLeft, ArrowLeft, Backpack } from "lucide-react";
import Link from "next/link";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
export default async function CourseSidebar({
  progressCount,
  course,
}: CourseSidebarProps) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <Link className="absolute top-7 left-2" href={`/search`}>
        <ArrowLeft />
      </Link>

      <div className="p-7 flex  items-center justify-center border-b">
        <h1 className="font-semibold">{course.title}</h1>
      </div>

      {purchase && (
        <div className="mt-10">
          <CourseProgress variant="success" value={progressCount} />
        </div>
      )}
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
}
