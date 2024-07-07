"use client";
import { Button } from "@/components/ui/button";
import formatPrice from "@/lib/format";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

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
      const response = await axios.post(
        `http://localhost:3000/api/courses/${courseId}/checkout`
      );

      window.location.assign(response.data.url);
    } catch (error) {
      console.log("error", error);
      toast.error("some thing went wrong");
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
      Enroll for {formatPrice(price)}
    </Button>
  );
}
