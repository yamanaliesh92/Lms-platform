import React from "react";
import Sidebar from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="w-56 fixed md:flex h-full flex-col inset-y-0 z-50">
        <Sidebar />
        hello
      </div>
      <main className="md:pl-56 h-full pt-[80px]">{children}</main>
    </div>
  );
}
