"use client";
import { Category, Course } from "@prisma/client";
import React from "react";
import CourseCard from "./course-card";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export default function CoursesList({ items }: CoursesListProps) {
  return (
    <div>
      <div className="grid p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            id={item.id}
            key={item.id}
            title={item.title}
            imgUrl={item.imgUrl!}
            chapterLength={1}
            price={item.price!}
            progress={item.progress}
            category={item.category?.name}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Course found{" "}
        </div>
      )}
    </div>
  );
}
