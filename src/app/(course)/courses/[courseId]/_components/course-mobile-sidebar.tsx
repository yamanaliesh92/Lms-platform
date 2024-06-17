import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CourseSidebar from "./course-sidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
export default function CourseMobileSidebar({
  course,
  progressCount,
}: CourseMobileSidebarProps) {
  return (
    <div className="md:hidden pr-4 hover:opacity-75 transition-all">
      <Sheet>
        <SheetTrigger className="md:hidden p-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 bg-white w-[250px]">
          <CourseSidebar course={course} progressCount={progressCount} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
