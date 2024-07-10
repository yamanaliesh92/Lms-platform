"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import * as z from "zod";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Attachment, Course } from "@prisma/client";
import FileUpload from "./file-uplaod";
import { useTranslations } from "next-intl";

interface IImageFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export default function AttachmentForm({
  initialData,
  courseId,
}: IImageFormProps) {
  const router = useRouter();
  const t = useTranslations("Attachment");
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toggle();
      router.refresh();
      toast.success("Updated success");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      setIsLoading(false);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-4 border bg-slate-100 dark:bg-background  rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        {t("name")}
        <Button onClick={toggle} variant={"ghost"}>
          {isEditing && <>{t("cancel")}</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("add")}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              {t("noResult")}
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 flex-shrink-0 mr-2" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}

                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint={"courseAttachment"}
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 ">{t("help")}</div>
        </div>
      )}
    </div>
  );
}
