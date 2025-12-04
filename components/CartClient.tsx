"use client";

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CartItem } from "@/contexts/CartContext";

function CheckoutButton({ items }: { items: CartItem[] }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const getCustomerInfo = () => {
    // Get customer info from localStorage if logged in
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
          };
        } catch (e) {
          // Invalid user data
        }
      }
    }
    return null;
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Prepare line items for Shopify checkout
      const lineItems = items.map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      }));

      // Get customer info if available
      const customerInfo = getCustomerInfo();

      // Create checkout in Shopify with customer information
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          lineItems,
          customerInfo: customerInfo || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Redirect to Shopify checkout URL
      if (data.checkout?.webUrl) {
        window.location.href = data.checkout.webUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Failed to proceed to checkout");
      setIsProcessing(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={isProcessing || items.length === 0}
        className="w-full rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {isProcessing ? "Redirecting to Shopify..." : "Proceed to Shopify Checkout"}
      </button>
    </>
  );
}

export default function CartClient() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-24 w-24 text-zinc-400 dark:text-zinc-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Your cart is empty
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Start shopping to add items to your cart
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.variant.id}
            className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Product Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
              <Image
                src={item.variant.image || "/next.svg"}
                alt={item.variant.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                {item.variant.title}
              </h3>
              {item.variant.selectedOptions && item.variant.selectedOptions.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {item.variant.selectedOptions.map((option, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {option.name}: {option.value}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                {item.variant.price}
              </p>
            </div>

            {/* Quantity and Remove */}
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeFromCart(item.variant.id)}
                className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                aria-label="Remove item"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                  className="w-8 h-8 rounded border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    updateQuantity(item.variant.id, Math.min(Math.max(1, val), 99));
                  }}
                  className="w-16 text-center rounded border border-zinc-200 bg-white px-2 py-1 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                />
                <button
                  onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                  className="w-8 h-8 rounded border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={clearCart}
          className="mt-4 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear Cart
        </button>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>{getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <div className="flex justify-between text-lg font-bold text-zinc-950 dark:text-zinc-50">
                <span>Total</span>
                <span>{getTotalPrice()}</span>
              </div>
            </div>
          </div>
          <CheckoutButton items={items} />
          <Link
            href="/products"
            className="mt-3 block w-full rounded-full border border-zinc-200 bg-white px-6 py-3 text-center text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

