import React from "react";
import MobileSidebar from "./mobile-sidebar";

import NavbarRoutes from "./navbar-routes";

export default function Navbar() {
  return (
    <div className="p-4 h-full shadow-sm flex items-center bg-background border-b">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
}
