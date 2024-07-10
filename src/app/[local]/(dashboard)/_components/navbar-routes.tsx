"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { UserButton } from "@clerk/nextjs";
import SearchInput from "./search-input";
import { ThemeToggle } from "./theme-toggle";
import LocalSwitcher from "@/components/local-switcher";
import { useTranslations } from "next-intl";

export default function NavbarRoutes() {
  const pathName = usePathname();
  const t = useTranslations("Navbar");

  const isTeacherPage = pathName.match("/teacher");
  const isCoursesPage = pathName.match("/courses");
  const isSearchPage = pathName === "/search";
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex items-center gap-x-2 ml-auto">
        {isTeacherPage ? (
          <Link href={"/"}>
            <Button variant={"ghost"} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              {t("exit")}
            </Button>
          </Link>
        ) : (
          <Link href={"/teacher/courses"}>
            <Button variant={"ghost"} size="sm">
              {t("teacher")}
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
        <ThemeToggle />
        <LocalSwitcher />
      </div>
    </>
  );
}
