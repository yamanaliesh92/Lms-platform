import { LucideIcon } from "lucide-react";
import React from "react";
import { IconBadge } from "../../_components/icon-badge";
import { getTranslations } from "next-intl/server";
interface InfoCardProps {
  label: string;
  numberOfItems: number;
  icon: LucideIcon;
  variant?: "default" | "success";
}
export default async function InfoCard({
  label,
  numberOfItems,
  variant,
  icon,
}: InfoCardProps) {
  const t = await getTranslations("InfoCard");
  return (
    <div className="flex items-center rounded-md border gap-x-2 p-3">
      <IconBadge variant={variant} icon={icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {numberOfItems} {numberOfItems <= 1 ? t("course") : t("courses")}
        </p>
      </div>
    </div>
  );
}
