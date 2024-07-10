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
import ClipLoader from "react-spinners/ClipLoader";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Metadata } from "next";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title Course is required" }),
});

export default function page() {
  const t = useTranslations("CreateCourse");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const from = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = from.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/courses", values);

      router.push(`/teacher/courses/${res.data.id}`);
      setIsLoading(false);
      toast.success("created success");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 ">
      <div>
        <h1 className="text-2xl">{t("name")}</h1>
        <p className="text-sm text-slate-600">{t("subName")}</p>

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
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g.'Advance web development"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href={"/"}>
                <Button variant={"ghost"} type="button">
                  {t("cancel")}
                </Button>
              </Link>
              <Button type={"submit"} disabled={!isValid || isSubmitting}>
                {isLoading ? (
                  <ClipLoader
                    color={"gray"}
                    loading={isLoading}
                    size={18}
                    aria-label="Loading Spinner"
                  />
                ) : (
                  t("continue")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
