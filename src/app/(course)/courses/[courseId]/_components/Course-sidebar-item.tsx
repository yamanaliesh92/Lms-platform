"use client";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface CourseSidebarItemProps {
  key: string;
  id: string;
  isLocked: boolean;
  courseId: string;
  isCompleted: boolean;
  label: string;
}

export default function CourseSidebarItem({
  id,
  key,
  isCompleted,
  isLocked,
  label,
  courseId,
}: CourseSidebarItemProps) {
  const pathName = usePathname();
  const router = useRouter();
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive = pathName?.includes(id);
  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-x-2 transition-all text-slate-500 text-sm font-[500] hover:text-slate-600 hover:bg-slate-300/20 ${
        isActive && "bg-slate-200 text-slate-700"
      } 
      ${isCompleted && "text-emerald-700 hover:text-emerald-700"}
      ${isCompleted && isActive && "bg-emerald-200/20"}
      `}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          className={`text-slate-500 ${isActive && "text-slate-700"} ${
            isCompleted && "text-emerald-700"
          }`}
        />
        {label}
      </div>
      <div
        className={`ml-auto opacity-0 border-2 border-slate-700 h-full transition-all ${
          isActive && "opacity-100"
        }
        ${isCompleted && "border-emerald-700"}
        `}
      />
    </button>
  );
}
