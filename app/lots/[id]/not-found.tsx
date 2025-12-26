import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 text-center">
      <h1 className="mb-4 text-2xl font-light text-gray-900">
        Лот не найден
      </h1>
      <Link href="/" className="text-primary hover:underline">
        Вернуться в каталог
      </Link>
    </div>
  );
}



