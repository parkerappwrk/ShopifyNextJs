"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      const accessToken = localStorage.getItem("shopifyAccessToken");

      if (!userStr || !accessToken) {
        // Not logged in, redirect to login
        router.push("/login");
        return;
      }

      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        router.push("/login");
        return;
      }
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("shopifyAccessToken");
    
    if (accessToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
        });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }

    localStorage.removeItem("user");
    localStorage.removeItem("shopifyAccessToken");
    localStorage.removeItem("shopifyTokenExpiresAt");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const navItems = [
    { href: "/account", label: "Personal Details", icon: "👤" },
    { href: "/account/orders", label: "My Orders", icon: "📦" },
    { href: "/account/change-password", label: "Change Password", icon: "🔒" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            My Account
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome back, {user.firstName || user.email}!
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
                        : "bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:bg-zinc-950 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

