"use client";
import { BarChart, Compass, Layout, List } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import SidebarItem from "./sidebar-items";
import { useTranslations } from "next-intl";

// const t = useTranslations("SideBarGuest");
// const guestRoute = [
//   { href: "/", icon: Layout, label: "Browse" },
//   { href: "/search", icon: Compass, label: "Search" },
// ];

// const teacherRoute = [
//   { href: "/teacher/courses", icon: List, label: "Courses" },
//   { href: "/teacher/analytics", icon: BarChart, label: "Analytics" },
// ];

export default function SidebarRoutes() {
  const t = useTranslations("Sidebar");

  const guestRoute = [
    { href: "/", icon: Layout, label: t("browse") },

    { href: "/search", icon: Compass, label: t("search") },
  ];

  const teacherRoute = [
    { href: "/teacher/courses", icon: List, label: t("courses") },
    { href: "/teacher/analytics", icon: BarChart, label: t("analytics") },
  ];
  const pathname = usePathname();
  const isTeacherPage = pathname.includes("/teacher");

  const routes = isTeacherPage ? teacherRoute : guestRoute;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          href={route.href}
          label={route.label}
          icon={route.icon}
        />
      ))}
    </div>
  );
}
