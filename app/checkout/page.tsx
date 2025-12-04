import type { Metadata } from "next";
import Link from "next/link";
import CheckoutClient from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-8">
          Checkout
        </h1>
        <CheckoutClient />
      </div>
    </div>
  );
}

