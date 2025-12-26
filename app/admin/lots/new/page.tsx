import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateLotForm } from "@/components/CreateLotForm";

async function checkAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) =>
    e.trim()
  ) || [];

  return adminEmails.includes(user.email || "");
}

export default async function CreateLotPage() {
  const isAdmin = await checkAdminAccess();

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-light text-gray-900">
        Создать новый лот
      </h1>
      <CreateLotForm />
    </div>
  );
}

