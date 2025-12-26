"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const lotSchema = z.object({
  name: z.string().min(1),
  roaster: z.string().min(1),
  country: z.string().optional(),
  region: z.string().optional(),
  variety: z.string().optional(),
  process: z.string().optional(),
  roast_level: z.string().optional(),
  flavor_notes: z.string().optional(),
  image_url: z.string().optional(),
});

const importLotSchema = z.object({
  name: z.string().min(1),
  roaster: z.string().min(1),
  country: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  variety: z.string().optional().nullable(),
  process: z.string().optional().nullable(),
  roast_level: z.string().optional().nullable(),
  flavor_notes: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
});

const importFileSchema = z.object({
  lots: z.array(importLotSchema),
});

export async function createLot(
  input: z.infer<typeof lotSchema>,
  imageFile: File | null
) {
  const validated = lotSchema.safeParse(input);

  if (!validated.success) {
    return { error: "Неверные данные" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходима авторизация" };
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) =>
    e.trim()
  ) || [];

  if (!adminEmails.includes(user.email || "")) {
    return { error: "Недостаточно прав" };
  }

  let imageUrl: string | null = null;

  if (imageFile) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `lot-images/${fileName}`;

    const serviceClient = await createServiceClient();
    const { error: uploadError } = await serviceClient.storage
      .from("lot-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { error: "Ошибка при загрузке изображения" };
    }

    const {
      data: { publicUrl },
    } = serviceClient.storage.from("lot-images").getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  const serviceClient = await createServiceClient();
  const { data, error } = await serviceClient
    .from("lots")
    .insert({
      ...validated.data,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) {
    return { error: "Ошибка при создании лота" };
  }

  revalidatePath("/");
  return { success: true, lotId: data.id };
}

async function downloadImageFromUrl(url: string): Promise<File | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = url.split("/").pop()?.split("?")[0] || `image-${Date.now()}.jpg`;
    const contentType = response.headers.get("content-type") || "image/jpeg";
    
    // Create File from buffer
    return new File([buffer], fileName, { type: contentType });
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
}

export async function importLotsFromFile(file: File) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходима авторизация" };
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) =>
    e.trim()
  ) || [];

  if (!adminEmails.includes(user.email || "")) {
    return { error: "Недостаточно прав" };
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const validated = importFileSchema.safeParse(parsed);

    if (!validated.success) {
      return { error: "Неверный формат файла" };
    }

    const serviceClient = await createServiceClient();
    const lots = validated.data.lots;
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const lot of lots) {
      try {
        let imageUrl: string | null = lot.image_url || null;

        // Если есть URL изображения, загружаем его
        if (lot.image_url && lot.image_url.startsWith("http")) {
          const imageFile = await downloadImageFromUrl(lot.image_url);
          if (imageFile) {
            const fileExt = imageFile.name.split(".").pop() || "jpg";
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `lot-images/${fileName}`;

            const { error: uploadError } = await serviceClient.storage
              .from("lot-images")
              .upload(filePath, imageFile, {
                cacheControl: "3600",
                upsert: false,
              });

            if (!uploadError) {
              const {
                data: { publicUrl },
              } = serviceClient.storage.from("lot-images").getPublicUrl(filePath);
              imageUrl = publicUrl;
            }
          }
        }

        const { error } = await serviceClient.from("lots").insert({
          name: lot.name,
          roaster: lot.roaster,
          country: lot.country || null,
          region: lot.region || null,
          variety: lot.variety || null,
          process: lot.process || null,
          roast_level: lot.roast_level || null,
          flavor_notes: lot.flavor_notes || null,
          image_url: imageUrl,
        });

        if (error) {
          results.failed++;
          results.errors.push(`${lot.name}: ${error.message}`);
        } else {
          results.success++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${lot.name}: ${error.message || "Неизвестная ошибка"}`);
      }
    }

    revalidatePath("/");
    return {
      success: true,
      imported: results.success,
      failed: results.failed,
      errors: results.errors,
    };
  } catch (error: any) {
    return { error: `Ошибка при чтении файла: ${error.message}` };
  }
}



