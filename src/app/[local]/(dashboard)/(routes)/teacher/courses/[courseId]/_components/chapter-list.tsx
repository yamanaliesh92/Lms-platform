"use client";
import { Chapter } from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

interface IChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export default function ChaptersList({
  items,
  onReorder,
  onEdit,
}: IChaptersListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  const t = useTranslations("PublishPage");

  useEffect(() => {
    setChapters(items);
  }, [items]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);
    const updatedChapters = items.slice(startIndex, endIndex + 1);
    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));
    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={`flex items-center gap-x-2 bg-slate-200 border text-slate-700 rounded-md mb-4 text-sm border-slate-200 ${
                      chapter.isPublished &&
                      "bg-sky-100 border-sky-200 text-sky-700"
                    } `}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={` ${
                        chapter.isPublished &&
                        "border-r-sky-200 hover:bg-sky-200"
                      } px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition `}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="w-5 h-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto gap-x-2 flex items-center">
                      {chapter.isFree && <h1>{t("free")}</h1>}
                      <h1
                        className={`bg-slate-500 text-white cursor-pointer rounded-md p-1 ${
                          chapter.isPublished && "bg-sky-700"
                        }`}
                      >
                        {chapter.isPublished ? t("publish") : t("draft")}
                      </h1>

                      <Pencil
                        cursor={"pointer"}
                        onClick={() => onEdit(chapter.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
