import React from "react";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex items-center justify-center my-4">
      {children}
    </div>
  );
}
