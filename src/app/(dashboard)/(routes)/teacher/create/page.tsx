"use client";
import React from "react";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
});

export default function page() {
  const router = useRouter();
  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = from.formState;

  const x = () => {
    router.push(`/teacher/courses/${1}`);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    .log(values);
    try {
      const res = await axios.post("http://localhost:3000/api/courses", values);
      router.push(`/teacher/courses/${res.data.id}`);
      toast.success("created success");
    } catch (err) {
      toast.error("some thing went wrong");
    }
  };

  return (
    <div className="d max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 ">
      <div>
        <h1 className="text-2xl">Name Your course</h1>
        <p className="text-sm text-slate-600">
          what would you like to name your course ? Dont worry{" "}
        </p>

        <Form {...from}>
          <form
            onSubmit={from.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              name="title"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g.'Advance web development"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    what will you teach in this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href={"/"}>
                <Button variant={"ghost"} type="button">
                  Cancel
                </Button>
              </Link>
              <Button type={"submit"} disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
