import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-zinc-950 hover:text-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-200"
            >
              Sign in
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

