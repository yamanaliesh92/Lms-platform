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
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Combobox } from "@/components/ui/combobox";
import { Course } from "@prisma/client";
import { useTranslations } from "next-intl";

interface IProps {
  initialData: Course;
  id: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Course category is required" }),
});

export default function CategoryForm({ initialData, id, options }: IProps) {
  const router = useRouter();
  const t = useTranslations("Category");

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
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
      toast.error("some thing went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const selectOption = options.find(
    (option) => option.value === initialData.categoryId
  );
  return (
    <div className="mt-4 border bg-slate-100 rounded-md p-2">
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
            !initialData.categoryId && "text-slate-500 italic"
          }  `}
        >
          {selectOption?.label || t("noResult")}
        </p>
      )}
      {isEditing && (
        <Form {...from}>
          <form
            onSubmit={from.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              name="categoryId"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={...options} {...field} />
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
