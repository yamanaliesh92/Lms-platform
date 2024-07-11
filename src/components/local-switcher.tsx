"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { loadavg } from "os";

export default function LocalSwitcher() {
  const router = useRouter();
  const locate = useLocale();
  const pathName = usePathname();

  const newPathname = pathName.substring(3);
  const handleLanguageChange = (value: string) => {
    router.push(`/${value}/${newPathname}`);
  };

  const selectedLanguage = locate === "en" ? "English" : "Italian";

  return (
    <Select onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder={selectedLanguage} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="it">Italian</SelectItem>
      </SelectContent>
    </Select>
  );
}
