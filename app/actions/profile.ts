"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  userId: z.string().uuid(),
  nickname: z.string().min(1).max(100),
});

export async function updateProfile(input: z.infer<typeof profileSchema>) {
  const validated = profileSchema.safeParse(input);

  if (!validated.success) {
    return { error: "Неверные данные" };
  }

  const { userId, nickname } = validated.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return { error: "Недостаточно прав" };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      nickname,
    });

  if (error) {
    return { error: "Ошибка при обновлении профиля" };
  }

  revalidatePath("/profile");
  return { success: true };
}



