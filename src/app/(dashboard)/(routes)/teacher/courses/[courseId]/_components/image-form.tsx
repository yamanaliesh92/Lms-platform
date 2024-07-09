"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import * as z from "zod";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "./file-uplaod";

interface IImageFormProps {
  initialData: Course;
  id: string;
}

const formSchema = z.object({
  imgUrl: z.string().min(1, { message: "Image is required" }),
});

export default function ImageForm({ initialData, id }: IImageFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggle = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`http://localhost:3000/api/courses/${id}`, values);
      toggle();
      router.refresh();
      toast.success("updated success");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="mt-4 border bg-slate-100 dark:bg-background  rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggle} variant={"ghost"}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imgUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imgUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imgUrl ? (
          <div className="flex items-center bg-slate-200 justify-center h-60 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              src={initialData.imgUrl}
              className="object-cover rounded-md"
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint={"courseImage"}
            onChange={(url) => {
              if (url) {
                onSubmit({ imgUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 ">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}
