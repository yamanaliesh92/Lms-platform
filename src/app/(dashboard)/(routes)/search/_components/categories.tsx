"use client";
import { Category } from "@prisma/client";
import React from "react";
import { IconType } from "react-icons";
import {
  FcEngineering,
  FcMusic,
  FcMultipleDevices,
  FcFilmReel,
  FcSalesPerformance,
  FcSportsMode,
  FcOldTimeCamera,
} from "react-icons/fc";
import CategoryItem from "./category-Item";

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  Filming: FcFilmReel,
  Engineering: FcEngineering,
};

interface CategoriesProps {
  items: Category[];
}
export default function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          value={item.id}
          icon={iconMap[item.name]}
        />
      ))}
    </div>
  );
}
