"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function Timer({ durationMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    // Only initialize timer once on client
    if (timeLeft === null) {
      setTimeLeft(durationMinutes * 60);
    }
  }, [durationMinutes, timeLeft]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  if (timeLeft === null) return <div>Loading timer...</div>;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center space-x-2 font-mono text-xl font-bold bg-gray-100 px-4 py-2 rounded-md shadow-inner border">
      <div className={`${timeLeft < 300 ? "text-red-600 animate-pulse" : "text-gray-800"}`}>
        Time Left: {hours > 0 ? `${hours}:` : ""}{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
}
