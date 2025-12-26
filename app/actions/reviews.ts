"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  lotId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  reviewId: z.string().uuid().optional(),
});

export async function submitReview(input: z.infer<typeof reviewSchema>) {
  const validated = reviewSchema.safeParse(input);

  if (!validated.success) {
    return { error: "Неверные данные" };
  }

  const { lotId, rating, comment, reviewId } = validated.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходима авторизация" };
  }

  if (reviewId) {
    const { error } = await supabase
      .from("reviews")
      .update({
        rating,
        comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) {
      return { error: "Ошибка при обновлении отзыва" };
    }
  } else {
    const { error } = await supabase.from("reviews").insert({
      lot_id: lotId,
      user_id: user.id,
      rating,
      comment,
    });

    if (error) {
      if (error.code === "23505") {
        return { error: "Вы уже оставили отзыв на этот лот" };
      }
      return { error: "Ошибка при создании отзыва" };
    }
  }

  revalidatePath(`/lots/${lotId}`);
  return { success: true };
}



