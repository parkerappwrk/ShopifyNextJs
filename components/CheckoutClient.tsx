"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "US",
    phone: "",
  });

  // Load customer data from localStorage if logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setFormData((prev) => ({
            ...prev,
            email: user.email || prev.email,
            firstName: user.firstName || prev.firstName,
            lastName: user.lastName || prev.lastName,
            phone: user.phone || prev.phone,
          }));
        } catch (e) {
          // Invalid user data
        }
      }
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Your cart is empty
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Add items to your cart before checkout
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    // Basic validation
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    if (!formData.firstName || !formData.lastName) {
      setError("Please enter your full name");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Prepare line items for Shopify checkout
      const lineItems = items.map((item) => ({
        variantId: item.variant.id, // Shopify variant GID
        quantity: item.quantity,
      }));

      // Prepare customer info
      const customerInfo = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        province: formData.province,
        zip: formData.zip,
        country: formData.country,
        phone: formData.phone,
      };

      // Create checkout in Shopify with customer information
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems, customerInfo }),
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
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50 mb-4">
            Shipping Information
          </h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="Apt, Suite, etc. (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="12345"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                  State / Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="US"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

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
          
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={() => handleCheckout()}
            disabled={isProcessing || items.length === 0}
            className="w-full rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isProcessing ? "Redirecting to Shopify..." : "Proceed to Shopify Checkout"}
          </button>
          <Link
            href="/cart"
            className="mt-3 block w-full rounded-full border border-zinc-200 bg-white px-6 py-3 text-center text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

