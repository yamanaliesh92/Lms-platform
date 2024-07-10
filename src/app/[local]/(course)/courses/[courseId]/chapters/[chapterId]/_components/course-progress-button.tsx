"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, Icon, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useConfettiStore } from "../../../../../../../../../hook/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapter?: string;
  isCompleted?: boolean;
}

export default function CourseProgressButton({
  courseId,
  chapterId,
  isCompleted,
  nextChapter,
}: CourseProgressButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const Icon = isCompleted ? XCircle : CheckCircle;
  const router = useRouter();
  const confetti = useConfettiStore();

  const onclick = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: !isCompleted }
      );
      if (!isCompleted && !nextChapter) {
        confetti.onOpen();
      }
      if (!isCompleted && nextChapter) {
        router.push(`/courses/${courseId}/chapters/${nextChapter}`);
      }
      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={onclick}
      disabled={isLoading}
      className="w-full md:w-auto"
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "Not Completed" : "Mark as Complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
}
