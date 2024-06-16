"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormMessage,
  Form,
  FormItem,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Chapter } from "@prisma/client";

interface IProps {
  initialData: Chapter;

  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export default function ChapterDescriptionForm({
  initialData,
  courseId,
  chapterId,
}: IProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });
  //   extract isSubmitting and isValid
  const { isSubmitting, isValid } = from.formState;

  const toggle = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      const res = await axios.patch(
        `http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toggle();
      router.refresh();
      toast.success("updated success");
    } catch (err) {
      toast.error("some thing went wrong");
    }
  };
  return (
    <div className="mt-4 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button onClick={toggle} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={`text-sm mt-2 ${
            !initialData && "text-slate-500 italic"
          }  `}
        >
          {!initialData.description && "No description"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...from}>
          <form
            onSubmit={from.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              name="description"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type={"submit"} disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
