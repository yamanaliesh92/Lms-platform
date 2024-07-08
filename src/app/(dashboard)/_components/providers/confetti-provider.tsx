"use client";

import React from "react";
import ReactConfetti from "react-confetti";
import { useConfettiStore } from "../../../../../hook/use-confetti-store";

export default function ConfettiProvider() {
  const confetti = useConfettiStore();
  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      className="pointer-events-none z-[1000]"
      numberOfPieces={1000}
      time
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  );
}
