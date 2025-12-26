import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";

async function getLot(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lots_with_rating")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getReviews(lotId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, profiles(nickname)")
    .eq("lot_id", lotId)
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}

async function getUserReview(lotId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("lot_id", lotId)
    .eq("user_id", userId)
    .single();

  return data;
}

export default async function LotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lot = await getLot(id);

  if (!lot) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const reviews = await getReviews(id);
  const userReview = user ? await getUserReview(id, user.id) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        {lot.image_url && (
          <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={lot.image_url}
              alt={lot.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h1 className="mb-2 text-3xl font-light text-gray-900">{lot.name}</h1>
        <p className="mb-4 text-lg text-gray-600">{lot.roaster}</p>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StarRating rating={lot.avg_rating || 0} />
            <span className="text-lg text-gray-700">
              {lot.avg_rating ? lot.avg_rating.toFixed(1) : "Нет оценок"}
            </span>
            <span className="text-gray-400">
              ({lot.reviews_count || 0} отзывов)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          {lot.country && (
            <div>
              <span className="font-medium">Страна:</span> {lot.country}
            </div>
          )}
          {lot.region && (
            <div>
              <span className="font-medium">Регион:</span> {lot.region}
            </div>
          )}
          {lot.variety && (
            <div>
              <span className="font-medium">Сорт:</span> {lot.variety}
            </div>
          )}
          {lot.process && (
            <div>
              <span className="font-medium">Обработка:</span> {lot.process}
            </div>
          )}
          {lot.roast_level && (
            <div>
              <span className="font-medium">Обжарка:</span> {lot.roast_level}
            </div>
          )}
        </div>

        {lot.flavor_notes && (
          <div className="mt-4">
            <span className="font-medium text-gray-900">Вкусовые ноты:</span>
            <p className="mt-1 text-gray-600">{lot.flavor_notes}</p>
          </div>
        )}
      </div>

      {user && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-medium text-gray-900">
            {userReview ? "Изменить отзыв" : "Оставить отзыв"}
          </h2>
          <ReviewForm lotId={id} initialReview={userReview} />
        </div>
      )}

      <div>
        <h2 className="mb-4 text-xl font-medium text-gray-900">Отзывы</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review: any) => (
              <div
                key={review.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm font-medium text-gray-900">
                      {review.profiles?.nickname || "Аноним"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(review.created_at), "d MMMM yyyy", {
                      locale: ru,
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Пока нет отзывов</p>
        )}
      </div>
    </div>
  );
}

