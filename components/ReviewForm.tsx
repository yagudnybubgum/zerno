"use client";

import { useState, useTransition } from "react";
import { StarRating } from "./StarRating";
import { submitReview } from "@/app/actions/reviews";

interface ReviewFormProps {
  lotId: string;
  initialReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

export function ReviewForm({ lotId, initialReview }: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [comment, setComment] = useState(initialReview?.comment || "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating === 0) {
      setError("Пожалуйста, выберите оценку");
      return;
    }

    startTransition(async () => {
      const result = await submitReview({
        lotId,
        rating,
        comment: comment.trim() || null,
        reviewId: initialReview?.id,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Оценка *
        </label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          interactive
          size="lg"
        />
      </div>

      <div>
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Комментарий (необязательно)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Поделитесь своими впечатлениями..."
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          Отзыв сохранен!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="rounded-md bg-primary px-6 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Сохранение..." : "Сохранить отзыв"}
      </button>
    </form>
  );
}



