"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface CatalogFiltersProps {
  countries: string[];
  roastLevels: string[];
  currentSearch: string;
  currentCountry: string;
  currentRoastLevel: string;
  currentSort: string;
}

export function CatalogFilters({
  countries,
  roastLevels,
  currentSearch,
  currentCountry,
  currentRoastLevel,
  currentSort,
}: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const search = formData.get("search") as string;
      updateParams("search", search);
    },
    [updateParams]
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={currentSearch}
          placeholder="Поиск по названию или обжарщику..."
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-2 text-sm text-white hover:bg-primary/90"
        >
          Поиск
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-4">
        <select
          value={currentCountry}
          onChange={(e) => updateParams("country", e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Все страны</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={currentRoastLevel}
          onChange={(e) => updateParams("roast_level", e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Все уровни обжарки</option>
          {roastLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-600">Сортировка:</label>
          <button
            onClick={() => updateParams("sort", "rating")}
            className={`rounded-md px-3 py-2 text-sm ${
              currentSort === "rating"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            По рейтингу
          </button>
          <button
            onClick={() => updateParams("sort", "popularity")}
            className={`rounded-md px-3 py-2 text-sm ${
              currentSort === "popularity"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            По популярности
          </button>
        </div>
      </div>
    </div>
  );
}



