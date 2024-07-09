import { LucideIcon } from "lucide-react";
import React from "react";
import { IconBadge } from "../../_components/icon-badge";
interface InfoCardProps {
  label: string;
  numberOfItems: number;
  icon: LucideIcon;
  variant?: "default" | "success";
}
export default function InfoCard({
  label,
  numberOfItems,
  variant,
  icon,
}: InfoCardProps) {
  return (
    <div className="flex items-center rounded-md border gap-x-2 p-3">
      <IconBadge variant={variant} icon={icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
}
