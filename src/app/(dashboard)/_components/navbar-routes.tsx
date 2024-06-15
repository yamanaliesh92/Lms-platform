"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default function NavbarRoutes() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const pathName = usePathname();

  const isTeacherPage = pathName.startsWith("/teacher");
  const isCoursesPage = pathName.startsWith("/courses");
  const isSearchPage = pathName === "/search";
  return (
    <>
      {isSearchPage && <div className="hidden md:block">search</div>}
      <div className="flex items-center gap-x-2 ml-auto">
        {isTeacherPage || isCoursesPage ? (
          <Link href={"/dash"}>
            <Button variant={"ghost"} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href={"/teacher/course"}>
            <Button variant={"ghost"} size="sm">
              Teacher mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
}
