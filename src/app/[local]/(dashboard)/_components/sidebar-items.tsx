"use client";
import { LucideIcon } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
interface ISidebarItem {
  label: string;
  key: string;
  icon: LucideIcon;
  href: string;
}
export default function SidebarItem({ icon: Icon, label, href }: ISidebarItem) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname.startsWith(`${href}/`);

  const click = () => {
    router.push(href);
  };
  return (
    <button
      type="button"
      onClick={click}
      className={` ${
        isActive
          ? "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
          : ""
      } flex items-center gap-x-2 text-slate-500 pl-6 font-[500] transition-all hover:text-slate-600 hover:bg-slate-300/20`}
    >
      <div className="flex items-center gap-x-2 py-4 ">
        <Icon />
        {label}
      </div>
      <div
        className={`h-full border-2 border-sky-700 ml-auto opacity-0 transition-all ${
          isActive ? "opacity-100" : ""
        }`}
      />
    </button>
  );
}
