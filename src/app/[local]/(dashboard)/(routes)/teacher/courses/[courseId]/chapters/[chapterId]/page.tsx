import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import ChapterActions from "../_components/chapter.action";
import ChapterTitleForm from "../_components/chapter-title-form";
import ChapterDescriptionForm from "../_components/chapter-description";
import ChapterAccessFormForm from "../_components/chapter-access";
import ChapterVideoForm from "../_components/chapter-video";
import { IconBadge } from "@/app/[local]/(dashboard)/_components/icon-badge";
import { Banner } from "@/app/[local]/(dashboard)/_components/banner";
export default async function page({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const chapter = await db.chapter.findUnique({
    where: { id: params.chapterId, courseId: params.courseId },
    include: { maxData: true },
  });
  if (!chapter) {
    redirect("/");
  }
  const requiredFiled = [chapter.description, chapter.videoUrl, chapter.title];
  const totalFields = requiredFiled.length;
  const completedFields = requiredFiled.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFiled.every(Boolean);

  return (
    <>
      <div className="p-6">
        {!chapter.isPublished && (
          <Banner
            variant={"warning"}
            label="This is chapter is unpublished .It will not be visible"
          />
        )}
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2 " />
              Back to course step
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disable={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl ">Customize your chapter</h2>
              </div>

              <ChapterTitleForm
                initialData={chapter}
                chapterId={params.chapterId}
                courseId={params.courseId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                chapterId={params.chapterId}
                courseId={params.courseId}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <ChapterAccessFormForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
}
