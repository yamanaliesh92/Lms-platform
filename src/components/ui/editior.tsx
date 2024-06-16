"use client";
import React, { useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}
export default function Editor({ onChange, value }: EditorProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
}
