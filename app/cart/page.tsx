import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CartClient from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your cart items and proceed to checkout",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-8">
          Shopping Cart
        </h1>
        <CartClient />
      </div>
    </div>
  );
}

