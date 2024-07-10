"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, useTransition } from "react";

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locate = useLocale();
  const pathName = usePathname();

  const x = pathName.substring(3);

  const onSleetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocate = e.target.value;

    startTransition(() => {
      router.push(`/${nextLocate}/${x}`);
    });
  };
  return (
    <label className="border-2 rounded-md">
      <p className="sr-only">Change language</p>
      <select
        defaultValue={locate}
        className="bg-transparent py-2 "
        onChange={onSleetChange}
        disabled={isPending}
      >
        <option value={"en"}>English</option>
        <option value={"ar"}>Arabic</option>
      </select>
    </label>
  );
}
