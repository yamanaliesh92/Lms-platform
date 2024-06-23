"use client";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useConfettiStore } from "../../../../../../../../hook/use-confetti-store";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapter?: string;
  completeOnEnd: boolean;
  isLocked: boolean;
  playbackId: string;
}

export default function VideoPlayer({
  chapterId,
  courseId,
  nextChapter,
  completeOnEnd,
  playbackId,
  isLocked,
  title,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: true }
      );
      if (!nextChapter) {
        confetti.onOpen();
      }
      toast.success("Progress updated");
      router.refresh();
      if (nextChapter) {
        router.push(`/courses/${courseId}/chapters/${nextChapter}`);
      }
    } catch {
      toast.error("some thing error ");
    }
  };
  return (
    <div className="relative aspect-video  w-full h-[300px]">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 ">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gay-2 text-secondary">
          <Lock className="h-8 w-8 " />
          <p className="text-sm">this chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          autoPlay
          className={`${!isReady && "hidden"} h-full mx-auto`}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          playbackId={playbackId}
        />
      )}
    </div>
  );
}
