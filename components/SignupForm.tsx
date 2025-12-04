"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptsMarketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      if (!firstName) {
        setError("Please enter your full name");
        setIsLoading(false);
        return;
      }

      // Create customer in Shopify
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          password: formData.password,
          acceptsMarketing: formData.acceptsMarketing,
        }),
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (!response.ok) {
        // Show detailed error message
        const errorMessage = data.error || data.message || "Registration failed";
        console.log("Registration error:", errorMessage, data);
        throw new Error(errorMessage);
      }

      // After successful registration, automatically log in
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        // Registration succeeded but login failed - redirect to login page
        router.push("/login?registered=true");
        return;
      }

      // Store access token and user data
      localStorage.setItem("shopifyAccessToken", loginData.accessToken);
      localStorage.setItem("shopifyTokenExpiresAt", loginData.expiresAt);
      localStorage.setItem("user", JSON.stringify(loginData.customer));

      // Redirect to home
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="Confirm your password"
          />
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="acceptsMarketing"
              name="acceptsMarketing"
              type="checkbox"
              checked={formData.acceptsMarketing}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-2 focus:ring-zinc-950 dark:border-zinc-600 dark:bg-zinc-800 dark:ring-offset-zinc-950 dark:focus:ring-zinc-50"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="acceptsMarketing"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              I want to receive marketing emails and updates
            </label>
            <p className="text-zinc-600 dark:text-zinc-400">
              You can unsubscribe at any time
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
}

