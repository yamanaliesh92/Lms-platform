import { db } from "@/lib/db";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import CourseProgress from "./course-progress";
import CourseSidebarItem from "./Course-sidebar-item";

//     course: Course & {
// chapter: Chapter[];
//   }; because include chapter

// const db = new aClient();
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
  // const {userId}=auth()
  // if(!user
  const userId = "1";
  const purchase = await db.purchase.findUnique({
    where: {
      // unique query
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  console.log("dddddD", purchase);

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-7 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}d</h1>
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
            isLocked={!purchase}
          />
        ))}
      </div>
    </div>
  );
}
