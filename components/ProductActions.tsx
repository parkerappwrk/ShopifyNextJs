"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import type { ProductVariant } from "@/lib/products";

interface ProductActionsProps {
  selectedVariant: ProductVariant | null;
  quantity: number;
  onAddToCart?: (variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (variant: ProductVariant, quantity: number) => void;
}

export default function ProductActions({
  selectedVariant,
  quantity,
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) {
      alert("Please select an available variant");
      return;
    }

    setIsLoading(true);
    try {
      addToCart(selectedVariant, quantity);
      onAddToCart?.(selectedVariant, quantity);
      
      // Show success message (you could use a toast notification instead)
      // For now, we'll just briefly show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) {
      alert("Please select an available variant");
      return;
    }

    setIsLoading(true);
    try {
      // Add to cart first, then redirect to checkout
      addToCart(selectedVariant, quantity);
      onBuyNow?.(selectedVariant, quantity);
      
      // Redirect to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Error proceeding to checkout:", error);
      alert("Failed to proceed to checkout. Please try again.");
      setIsLoading(false);
    }
  };

  const isDisabled = !selectedVariant || !selectedVariant.availableForSale || isLoading;

  return (
    <div className="flex gap-4 pt-4">
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className="flex-1 rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={isDisabled}
        className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
      >
        {isLoading ? "Loading..." : "Buy Now"}
      </button>
    </div>
  );
}

