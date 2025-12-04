import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const registered = params?.registered === "true";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Or{" "}
            <Link
              href="/signup"
              className="font-medium text-zinc-950 hover:text-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-200"
            >
              create a new account
            </Link>
          </p>
        </div>
        {registered && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900 dark:text-green-300">
            Account created successfully! Please sign in to continue.
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}

