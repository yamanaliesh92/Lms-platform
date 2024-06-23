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
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import formatPrice from "@/lib/format";

interface IProps {
  initialData: Course;
  id: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

export default function PriceForm({ initialData, id }: IProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = from.formState;

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
      toast.error("some thing went wrong");
    }
  };
  return (
    <div className="mt-4 border bg-slate-100 dark:bg-background  rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Course Price
        <Button onClick={toggle} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={`text-sm mt-2 ${
            !initialData.price && "text-slate-500 italic"
          }  `}
        >
          {initialData.price ? formatPrice(initialData.price) : "No price"}
        </p>
      )}
      {isEditing && (
        <Form {...from}>
          <form
            onSubmit={from.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              name="price"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type={"number"}
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Set a price for your course... '"
                      {...field}
                    />
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
