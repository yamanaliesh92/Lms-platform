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
import { Loader2, PlusCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Chapter, Course } from "@prisma/client";
import ChaptersList from "./chapter-list";
import { useTranslations } from "next-intl";
import { ClipLoader } from "react-spinners";

interface IProps {
  initialData: Course & { chapters: Chapter[] };
  courserId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export default function ChapterForm({ initialData, courserId }: IProps) {
  const router = useRouter();
  const t = useTranslations("Chapter");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = from.formState;

  const toggleCreating = () => {
    setIsCreating((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courserId}/chapters`, values);
      setIsLoading(false);
      toggleCreating();
      router.refresh();
      toast.success("Chapter created");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courserId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`${courserId}/chapters/${id}`);
  };
  return (
    <div className="mt-4 relative border bg-slate-100 dark:bg-background  rounded-md p-2">
      {isUpdating && (
        <div className="absolute h-full w-full top-0 right-0 rounded-md flex items-center justify-center bg-slate-500/20  mt-6  p-4">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        {t("name")}
        <Button onClick={toggleCreating} variant={"ghost"}>
          {isCreating ? (
            <>{t("cancel")}</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("add")}
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...from}>
          <form
            onSubmit={from.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              name="title"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g.'Introduction to the course '"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type={"submit"} disabled={!isValid || isSubmitting}>
              {isLoading ? (
                <ClipLoader
                  color={"gray"}
                  loading={isLoading}
                  size={18}
                  aria-label="Loading Spinner"
                />
              ) : (
                t("create")
              )}
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={"text-sm mt-2 "}>
          {!initialData.chapters.length && (
            <div className="text-slate-400">{t("noResult")} </div>
          )}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">{t("drag")}</p>
      )}
    </div>
  );
}
