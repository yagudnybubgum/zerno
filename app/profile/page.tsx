import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = 'force-dynamic';

async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return data;
}

async function getUserReviews(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, lots(id, name, roaster)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile(user.id);
  const reviews = await getUserReviews(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-light text-gray-900">Профиль</h1>

      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-medium text-gray-900">
          Личная информация
        </h2>
        <ProfileForm
          userId={user.id}
          initialNickname={profile?.nickname || ""}
        />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-medium text-gray-900">
          Мои отзывы ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <Link
                key={review.id}
                href={`/lots/${review.lots.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {review.lots.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {review.lots.roaster}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      Оценка: {review.rating}/5
                    </p>
                    {review.comment && (
                      <p className="mt-1 text-sm text-gray-600">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Вы еще не оставили ни одного отзыва</p>
        )}
      </div>
    </div>
  );
}



