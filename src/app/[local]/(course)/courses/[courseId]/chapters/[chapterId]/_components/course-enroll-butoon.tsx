"use client";
import { Button } from "@/components/ui/button";
import formatPrice from "@/lib/format";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export default function CourseEnrollButton({
  price,
  courseId,
}: CourseEnrollButtonProps) {
  const [isLoading, setISLoading] = useState(false);

  const onClick = async () => {
    try {
      setISLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      setISLoading(false);
      window.location.assign(response.data.url);
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong");
    } finally {
      setISLoading(false);
    }
  };
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size={"sm"}
      className="w-full md:w-auto"
    >
      {isLoading ? (
        <ClipLoader
          color={"gray"}
          loading={isLoading}
          size={18}
          aria-label="Loading Spinner"
        />
      ) : (
        `Enroll for ${formatPrice(price)}`
      )}
    </Button>
  );
}
