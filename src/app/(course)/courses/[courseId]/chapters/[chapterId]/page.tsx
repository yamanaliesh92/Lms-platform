import { File } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import CourseEnrollButton from "./_components/course-enroll-butoon";
import CourseProgressButton from "./_components/course-progress-button";
import VideoPlayer from "./_components/video-player";
import { Banner } from "@/app/(dashboard)/_components/banner";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Preview from "@/components/Preview";
import { getChapter } from "../../../../../../../action/get-chapter";

export default async function page({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    userProgress,
    purchase,
    nextChapter,
    attachments,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant={"success"}
          label="you already completed this chapter."
        />
      )}

      {isLocked && (
        <Banner
          variant={"warning"}
          label="you need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl pb-20 mx-auto">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapter={nextChapter?.id!}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapter={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                price={course.price!}
                courseId={params.courseId}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 text-sky-700 border rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
