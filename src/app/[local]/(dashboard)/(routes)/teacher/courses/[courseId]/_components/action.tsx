"use client";

import ConfirmModal from "@/components/modals/confrim-modals";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { useConfettiStore } from "../../../../../../../../../hook/use-confetti-store";
import { useTranslations } from "next-intl";
import { ClipLoader } from "react-spinners";

interface IActionProps {
  disable: boolean;
  courseId: string;
  isPublished: boolean;
}

export default function ChapterActions({
  disable,
  courseId,
  isPublished,
}: IActionProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const t = useTranslations("PublishPage");
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/api/courses/${courseId}`);
      toast.success("Course deleted");
      router.refresh();
      router.push("/teacher/course");
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
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unPublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published");
        confetti.onOpen();
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
