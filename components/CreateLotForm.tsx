"use client";

import { useState, useTransition } from "react";
import { createLot, importLotsFromFile } from "@/app/actions/lots";

export function CreateLotForm() {
  const [formData, setFormData] = useState({
    name: "",
    roaster: "",
    country: "",
    region: "",
    variety: "",
    process: "",
    roast_level: "",
    flavor_notes: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name || !formData.roaster) {
      setError("Название и обжарщик обязательны");
      return;
    }

    startTransition(async () => {
      const result = await createLot(formData, image);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setFormData({
          name: "",
          roaster: "",
          country: "",
          region: "",
          variety: "",
          process: "",
          roast_level: "",
          flavor_notes: "",
        });
        setImage(null);
        setTimeout(() => {
          window.location.href = `/lots/${result.lotId}`;
        }, 1500);
      }
    });
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setImportResult(null);

    if (!importFile) {
      setError("Выберите файл для импорта");
      return;
    }

    setIsImporting(true);
    try {
      const result = await importLotsFromFile(importFile);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setImportResult({
          imported: result.imported || 0,
          failed: result.failed || 0,
          errors: result.errors || [],
        });
        setImportFile(null);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при импорте");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-xl font-medium text-gray-900">
          Импорт лотов из файла
        </h2>
        <form onSubmit={handleImport} className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div>
            <label
              htmlFor="importFile"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Файл с лотами (JSON)
            </label>
            <input
              id="importFile"
              type="file"
              accept=".json,.txt"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-500">
              Загрузите JSON файл с массивом лотов
            </p>
          </div>

          {importResult && (
            <div className="rounded-md bg-blue-50 p-3 text-sm">
              <p className="font-medium text-blue-900">
                Импортировано: {importResult.imported}, Ошибок: {importResult.failed}
              </p>
              {importResult.errors.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-blue-800">
                  {importResult.errors.slice(0, 5).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                  {importResult.errors.length > 5 && (
                    <li>... и еще {importResult.errors.length - 5} ошибок</li>
                  )}
                </ul>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isImporting || !importFile}
            className="w-full rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isImporting ? "Импорт..." : "Импортировать лоты"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-medium text-gray-900">
          Создать лот вручную
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Название *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="roaster"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Обжарщик *
        </label>
        <input
          id="roaster"
          type="text"
          value={formData.roaster}
          onChange={(e) =>
            setFormData({ ...formData, roaster: e.target.value })
          }
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Страна
          </label>
          <input
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="region"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Регион
          </label>
          <input
            id="region"
            type="text"
            value={formData.region}
            onChange={(e) =>
              setFormData({ ...formData, region: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="variety"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Сорт
          </label>
          <input
            id="variety"
            type="text"
            value={formData.variety}
            onChange={(e) =>
              setFormData({ ...formData, variety: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="process"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Обработка
          </label>
          <input
            id="process"
            type="text"
            value={formData.process}
            onChange={(e) =>
              setFormData({ ...formData, process: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="roast_level"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Уровень обжарки
        </label>
        <input
          id="roast_level"
          type="text"
          value={formData.roast_level}
          onChange={(e) =>
            setFormData({ ...formData, roast_level: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Например: Светлая, Средняя, Темная"
        />
      </div>

      <div>
        <label
          htmlFor="flavor_notes"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Вкусовые ноты
        </label>
        <textarea
          id="flavor_notes"
          value={formData.flavor_notes}
          onChange={(e) =>
            setFormData({ ...formData, flavor_notes: e.target.value })
          }
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Изображение
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
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
          Лот создан! Перенаправление...
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary px-6 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Создание..." : "Создать лот"}
      </button>
    </form>
      </div>
    </div>
  );
}



