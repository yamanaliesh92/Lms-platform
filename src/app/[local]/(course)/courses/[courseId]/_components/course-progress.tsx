import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import React from "react";

interface CourseProgress {
  variant?: "default" | "success";
  size?: "default" | "sm";
  value: number;
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};
export default function CourseProgress({
  value,
  size,
  variant,
}: CourseProgress) {
  return (
    <div>
      <Progress variant={variant} className="h-2" value={value} />
      <p
        className={cn(
          "font-medium text-sky-700 mt-2",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"]
        )}
      >
        {Math.round(value)}% complete
      </p>
    </div>
  );
}
