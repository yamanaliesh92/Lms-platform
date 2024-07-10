"use client";

import ConfirmModal from "@/components/modals/confrim-modals";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

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
  const t = useTranslations("PublishPage");
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
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
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success("Chapter unPublished");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
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
        {isLoading ? (
          <ClipLoader
            color={"gray"}
            loading={isLoading}
            size={18}
            aria-label="Loading Spinner"
          />
        ) : isPublished ? (
          t("unPublish")
        ) : (
          t("publish")
        )}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} size={"sm"}>
          <Trash className="h-4 w-4 " />
        </Button>
      </ConfirmModal>
    </div>
  );
}
