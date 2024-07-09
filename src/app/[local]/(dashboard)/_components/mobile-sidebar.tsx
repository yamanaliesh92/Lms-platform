import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
  return (
    <div className="md:hidden pr-4 hover:opacity-75 transition-all">
      <Sheet>
        <SheetTrigger className="md:hidden p-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 bg-white w-[250px]">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
