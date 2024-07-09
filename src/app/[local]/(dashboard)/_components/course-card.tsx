import formatPrice from "@/lib/format";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconBadge } from "./icon-badge";
import CourseProgress from "../../(course)/courses/[courseId]/_components/course-progress";

interface CourseCardProps {
  title: string;
  key: string;
  id: string;
  imgUrl: string;
  price: number;
  category: string | undefined;
  chapterLength: number;
  progress: number | null;
}
export default function CourseCard({
  title,
  key,
  imgUrl,
  price,
  progress,
  category,
  chapterLength,
  id,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          {imgUrl ? (
            <Image fill src={imgUrl} alt={title} className="object-cover" />
          ) : null}
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base group-hover:text-sky-700 font-medium line-clamp-2 transition">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {chapterLength} {chapterLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress === 100 ? "success" : "default"}
            />
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700 ">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
