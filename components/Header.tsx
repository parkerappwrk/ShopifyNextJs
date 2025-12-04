"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { getTotalItems } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    setCartCount(getTotalItems());
    
    // Check for user in localStorage and validate token
    const loadUser = async () => {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("shopifyAccessToken");
        const expiresAt = localStorage.getItem("shopifyTokenExpiresAt");
        const userStr = localStorage.getItem("user");

        // Check if token is expired
        if (expiresAt && new Date(expiresAt) < new Date()) {
          // Token expired, clear everything
          localStorage.removeItem("user");
          localStorage.removeItem("shopifyAccessToken");
          localStorage.removeItem("shopifyTokenExpiresAt");
          return;
        }

        if (accessToken && userStr) {
          try {
            // Verify token is still valid by fetching user data
            const response = await fetch("/api/auth/me", {
              headers: {
                "x-access-token": accessToken,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUser(data.customer);
            } else {
              // Token invalid, clear everything
              localStorage.removeItem("user");
              localStorage.removeItem("shopifyAccessToken");
              localStorage.removeItem("shopifyTokenExpiresAt");
            }
          } catch (error) {
            console.error("Error validating token:", error);
            // Fallback to stored user data
            if (userStr) {
              try {
                setUser(JSON.parse(userStr));
              } catch (e) {
                // Invalid user data
              }
            }
          }
        } else if (userStr) {
          // Fallback to stored user data if no token
          try {
            setUser(JSON.parse(userStr));
          } catch (e) {
            // Invalid user data
          }
        }
      }
    };

    loadUser();
  }, [getTotalItems]);

  // Update cart count when it changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCartCount(getTotalItems());
    }, 500);
    return () => clearInterval(interval);
  }, [getTotalItems]);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("shopifyAccessToken");
    
    if (accessToken) {
      try {
        // Delete access token from Shopify
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
        });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }

    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("shopifyAccessToken");
    localStorage.removeItem("shopifyTokenExpiresAt");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Logo"
            width={100}
            height={20}
            priority
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative rounded-full border border-zinc-200 bg-white p-2 text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {user?.firstName || user?.name || user?.email}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

