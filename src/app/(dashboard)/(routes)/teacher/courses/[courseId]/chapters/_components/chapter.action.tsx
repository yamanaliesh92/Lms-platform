"use client";

import ConfirmModal from "@/components/modals/confrim-modals";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface IChapterActionProps {
  disable: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export default function ChapterActions({
  disable,
  chapterId,
  courseId,
  isPublished,
}: IChapterActionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}`
      );
      toast.success("Chapter deleted");
      router.refresh();
      router.push(`/teacher/course/${courseId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success("Chapter unPublished");
      } else {
        await axios.patch(
          `http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success("Chapter published");
        router.push(`/teacher/courses/${courseId}`);
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disable || isLoading}
        variant="outline"
        size={"sm"}
      >
        {isPublished ? "Unpublished" : "published"}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} size={"sm"}>
          <Trash className="h-4 w-4 " />
        </Button>
      </ConfirmModal>
    </div>
  );
}
