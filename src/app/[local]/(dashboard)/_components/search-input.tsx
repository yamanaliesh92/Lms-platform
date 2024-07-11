"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import qs from "query-string";
import { useDebounce } from "../../../../../hook/useDebounce";
import { useTranslations } from "next-intl";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const t = useTranslations("SearchPage");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathName]);
  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px]  dark:text-black pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder={t("placeholder")}
      />
    </div>
  );
}
