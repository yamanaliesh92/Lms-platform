import React from "react";
import { auth } from "@clerk/nextjs/server";
import Categories from "./_components/categories";
import { redirect } from "next/navigation";
import SearchInput from "../../_components/search-input";
import { getCourses } from "../../../../../../action/get-course";
import CoursesList from "../../_components/course-list";
import { db } from "@/lib/db";

interface SearchPageProps {
  searchParams: { title: string; categoryId: string };
}

export default async function page({ searchParams }: SearchPageProps) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  console.log("use", userId);

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  const { title, categoryId } = searchParams;

  const courses = await getCourses({
    categoryId: categoryId,
    userId: userId,
    title: title,
  });

  return (
    <>
      <div className="px-6 pt-6  md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
      </div>
      <CoursesList items={courses} />
    </>
  );
}
