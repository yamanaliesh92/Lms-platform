import { db } from "@/lib/db";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Actions from "./_components/action";
import AttachmentForm from "./_components/attachment-form";
import CategoryForm from "./_components/category-form";
import ChapterForm from "./_components/chapter-form";
import DescriptionForm from "./_components/description-form";

import ImageForm from "./_components/image-form";
import PriceForm from "./_components/price-form";

interface Ix {
  params: {
    courseId: string;
  };
}

export default async function page({ params }: Ix) {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const course = await db.course.findUnique({
    where: { id: params.courseId, userId },
    include: {
      chapters: { orderBy: { position: "asc" } },
      attachments: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!course) {
    redirect("/dash");
  }
  const requiredFields = [
    course.title,
    course.description,
    course.imgUrl,
    course.price,
    course.chapters.some((chapter) => chapter.isPublished),
    course.categoryId,
  ];
  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;
  const completionFields = `(${completedFields}/${totalFields})`;

  const isCompleted = requiredFields.every(Boolean);
  return (
    <>
      {!isCompleted ||
        (!course.isPublished && (
          <Banner label="this course is not publish ,It will not be visible to the student" />
        ))}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              {" "}
              Complete all fields {completionFields}
            </span>
          </div>
          {/* add action to publish the course */}
          <Actions
            disable={!isCompleted}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <FormTitle initialData={course} id={course.id} />

            <DescriptionForm initialData={course} id={course.id} />

            <ImageForm initialData={course} id={course.id} />

            <CategoryForm
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              initialData={course}
              id={course.id}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapter</h2>
              </div>
              <ChapterForm initialData={course} courserId={course.id} />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} id={course.id} />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resource & Attachments </h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </>
  );
}
