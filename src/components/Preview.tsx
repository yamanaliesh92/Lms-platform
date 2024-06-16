"use client";
import React, { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";
import dynamic from "next/dynamic";

interface PreviewProps {
  value: string;
}
export default function Preview({ value }: PreviewProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return <ReactQuill theme="bubble" value={value} readOnly />;
}
