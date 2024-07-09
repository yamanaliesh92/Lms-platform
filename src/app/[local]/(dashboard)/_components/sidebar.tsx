import React from "react";
import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full shadow-sm border-r overflow-y-auto">
      <div className="p-6">
        <Logo />
      </div>
      <div className="w-full flex-col flex">
        <SidebarRoutes />
      </div>
    </div>
  );
}
