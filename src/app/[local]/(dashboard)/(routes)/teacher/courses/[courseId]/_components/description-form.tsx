"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormDescription,
  FormControl,
  FormField,
  FormMessage,
  Form,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { ClipLoader } from "react-spinners";

interface IProps {
  initialData: {
    description: string | null;
  };
  id: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Course description is required" }),
});

export default function DescriptionForm({ initialData, id }: IProps) {
  const router = useRouter();
  const t = useTranslations("Description");

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = from.formState;

  const toggle = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/courses/${id}`, values);
      setIsLoading(false);
      toggle();
      router.refresh();
      toast.success("updated success");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-4 border bg-slate-100 dark:bg-background  rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        {t("name")}
        <Button onClick={toggle} variant={"ghost"}>
          {isEditing ? (
            <>{t("cancel")}</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {t("edit")}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={`text-sm mt-2 ${
            !initialData && "text-slate-500 italic"
          }  `}
        >
          {initialData.description || t("noResult")}
        </p>
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
                    <Textarea
                      autoFocus={true}
                      disabled={isSubmitting}
                      placeholder="e.g.'this course is about... '"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type={"submit"} disabled={!isValid || isSubmitting}>
                {isLoading ? (
                  <ClipLoader
                    color={"gray"}
                    loading={isLoading}
                    size={18}
                    aria-label="Loading Spinner"
                  />
                ) : (
                  t("save")
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
