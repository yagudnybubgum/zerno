"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/profile";

interface ProfileFormProps {
  userId: string;
  initialNickname: string;
}

export function ProfileForm({ userId, initialNickname }: ProfileFormProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateProfile({ userId, nickname });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="nickname"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Никнейм
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          Профиль обновлен!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-6 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  );
}



