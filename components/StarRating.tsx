"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  onRatingChange,
  interactive = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${sizeClasses[size]} ${
            interactive
              ? "cursor-pointer transition-transform hover:scale-110"
              : "cursor-default"
          }`}
        >
          <svg
            viewBox="0 0 20 20"
            fill={star <= displayRating ? "var(--color-secondary)" : "none"}
            stroke={
              star <= displayRating
                ? "var(--color-secondary)"
                : "currentColor"
            }
            className="w-full h-full text-gray-300"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        </button>
      ))}
    </div>
  );
}



