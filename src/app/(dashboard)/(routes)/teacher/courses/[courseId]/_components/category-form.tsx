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

import { Combobox } from "@/components/ui/combobox";
import { Course } from "@prisma/client";

interface IProps {
  initialData: Course;
  id: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

export default function CategoryForm({ initialData, id, options }: IProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
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
      await axios.patch(`http://localhost:3000/api/courses/${id}`, values);
      toggle();
      router.refresh();
      toast.success("updated success");
    } catch (err) {
      toast.error("some thing went wrong");
    }
  };

  const selectOption = options.find(
    (option) => option.value === initialData.categoryId
  );
  return (
    <div className="mt-4 border bg-slate-100 dark:bg-background  rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button onClick={toggle} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Category
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
          {selectOption?.label || "No category"}
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
