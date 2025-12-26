import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { CatalogFilters } from "@/components/CatalogFilters";
import { StarRating } from "@/components/StarRating";

interface SearchParams {
  search?: string;
  country?: string;
  roast_level?: string;
  sort?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-lg font-medium text-red-900">
            Требуется настройка Supabase
          </h2>
          <p className="text-sm text-red-700">
            Создайте файл <code className="rounded bg-red-100 px-1 py-0.5">.env.local</code> с
            переменными окружения Supabase. Подробности в README.md
          </p>
        </div>
      </div>
    );
  }

  let query = supabase
    .from("lots_with_rating")
    .select("*")
    .order("avg_rating", { ascending: false, nullsFirst: false });

  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase();
    query = query.or(
      `name.ilike.%${searchTerm}%,roaster.ilike.%${searchTerm}%`
    );
  }

  if (searchParams.country) {
    query = query.eq("country", searchParams.country);
  }

  if (searchParams.roast_level) {
    query = query.eq("roast_level", searchParams.roast_level);
  }

  if (searchParams.sort === "popularity") {
    query = query.order("reviews_count", { ascending: false });
  }

  const { data: lots, error } = await query;

  if (error) {
    console.error("Error fetching lots:", error);
  }

  const { data: countries } = await supabase
    .from("lots")
    .select("country")
    .not("country", "is", null);

  const uniqueCountries = Array.from(
    new Set(countries?.map((c) => c.country).filter(Boolean) || [])
  ).sort();

  const { data: roastLevels } = await supabase
    .from("lots")
    .select("roast_level")
    .not("roast_level", "is", null);

  const uniqueRoastLevels = Array.from(
    new Set(roastLevels?.map((r) => r.roast_level).filter(Boolean) || [])
  ).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-light text-gray-900">
        Каталог кофе
      </h1>

      <CatalogFilters
        countries={uniqueCountries}
        roastLevels={uniqueRoastLevels}
        currentSearch={searchParams.search || ""}
        currentCountry={searchParams.country || ""}
        currentRoastLevel={searchParams.roast_level || ""}
        currentSort={searchParams.sort || "rating"}
      />

      {lots && lots.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lots.map((lot: any) => (
            <Link
              key={lot.id}
              href={`/lots/${lot.id}`}
              className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              {lot.image_url && (
                <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={lot.image_url}
                    alt={lot.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <h2 className="mb-2 text-lg font-medium text-gray-900">
                {lot.name}
              </h2>
              <p className="mb-2 text-sm text-gray-600">{lot.roaster}</p>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                <span>{lot.country}</span>
                {lot.roast_level && (
                  <>
                    <span>•</span>
                    <span>{lot.roast_level}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={lot.avg_rating || 0} size="sm" />
                <span className="text-sm text-gray-600">
                  {lot.avg_rating
                    ? lot.avg_rating.toFixed(1)
                    : "Нет оценок"}
                </span>
                <span className="text-sm text-gray-400">
                  ({lot.reviews_count || 0})
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-500">
          Кофейные лоты не найдены
        </div>
      )}
    </div>
  );
}

