import React from "react";
import Logo from "./logo";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full shadow-sm border-r overflow-y-auto">
      <div className="p-6">
        <Logo />
      </div>
      <div className="w-full flex-col flex">navbar-routes</div>
    </div>
  );
}
