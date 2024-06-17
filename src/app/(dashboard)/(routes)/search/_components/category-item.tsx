"use client";
import { Category } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import qs from "query-string";
interface CategoryProps {
  label?: string;
  key?: string;
  icon?: IconType;
  value?: string;
}

export default function CategoryItem({
  label,
  value,
  key,
  icon: Icon,
}: CategoryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  console.log("c", value);
  const currentTitle = searchParams.get("title");
  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: { title: currentTitle, categoryId: isSelected ? null : value },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };
  return (
    <div>
      <button
        onClick={onClick}
        className={`${
          isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
        } py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 transition hover:border-sky-700`}
        type="button"
      >
        {Icon && <Icon size={20} />}
        <div className="truncate">{label}</div>
      </button>
    </div>
  );
}
