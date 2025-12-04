import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-950 dark:text-zinc-50">
          Product Not Found
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
}

