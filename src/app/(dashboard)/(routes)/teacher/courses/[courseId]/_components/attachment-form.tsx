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
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggle = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/courses/${courseId}/attachments`,
        values
      );
      toggle();
      router.refresh();
      toast.success("updated success");
    } catch (err) {
      toast.error("some thing went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      const res = await axios.delete(
        `http://localhost:3000/api/courses/${courseId}/attachments/${id}`
      );
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("some thing went wrong");
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="mt-4 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Course attachment
        <Button onClick={toggle} variant={"ghost"}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an attachment
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet{" "}
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
          <div className="text-xs text-muted-foreground mt-4 ">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
}
