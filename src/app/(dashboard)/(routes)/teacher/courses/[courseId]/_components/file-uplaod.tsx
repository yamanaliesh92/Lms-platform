"use client";
import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";

import React from "react";
import { toast } from "react-hot-toast";

interface IFileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof OurFileRouter;
}
export default function FileUpload({ onChange, endpoint }: IFileUploadProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
}
