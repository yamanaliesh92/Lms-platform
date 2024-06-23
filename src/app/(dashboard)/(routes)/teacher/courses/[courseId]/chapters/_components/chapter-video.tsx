"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import * as z from "zod";
import { Pencil, PlusCircle, Video } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Chapter, MuxData } from "@prisma/client";

import MuxPlayer from "@mux/mux-player-react";
import FileUpload from "../../_components/file-uplaod";

interface IChapterVideoProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export default function ChapterVideoForm({
  initialData,
  courseId,
  chapterId,
}: IChapterVideoProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggle = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toggle();
      router.refresh();
      toast.success("Chapter success");
    } catch (err) {
      toast.error("some thing went wrong");
    }
  };
  return (
    <div className="mt-4 border bg-slate-100 dark:bg-background  rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggle} variant={"ghost"}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center bg-slate-200 justify-center h-60 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint={"chapterVideo"}
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 ">
            Upload this chapter`s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          video can take a few minutes to process.Refresh the page if video
          doesn't appear
        </div>
      )}
    </div>
  );
}
