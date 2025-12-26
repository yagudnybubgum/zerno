import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-light text-gray-900">Регистрация</h1>
      <SignupForm />
    </div>
  );
}



