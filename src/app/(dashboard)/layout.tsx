import React from "react";
import Navbar from "./_components/navbar";

import Sidebar from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 z-50 w-full">
        <Navbar />d
      </div>
      <div className="w-56 fixed hidden md:flex h-full flex-col inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full pt-[80px]">{children}</main>
    </div>
  );
}
