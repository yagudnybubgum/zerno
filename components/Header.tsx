import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  let user = null;
  let isAdmin = false;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;

    if (user) {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) =>
        e.trim()
      ) || [];
      isAdmin = adminEmails.includes(user.email || "");
    }
  } catch (error) {
    // Supabase not configured
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-primary">
            Зерно
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin/lots/new"
                    className="text-sm text-gray-700 hover:text-primary"
                  >
                    Создать лот
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-sm text-gray-700 hover:text-primary"
                >
                  Профиль
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-sm text-gray-700 hover:text-primary"
                  >
                    Выйти
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-primary"
                >
                  Войти
                </Link>
                <Link
                  href="/signup"
                  className="text-sm text-gray-700 hover:text-primary"
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

