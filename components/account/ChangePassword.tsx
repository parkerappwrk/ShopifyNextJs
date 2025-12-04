"use client";

import { useState } from "react";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("shopifyAccessToken");
      
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      // TODO: Update password via Shopify API
      // For now, we'll simulate the API call
      // const response = await fetch("/api/account/change-password", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "x-access-token": accessToken,
      //   },
      //   body: JSON.stringify({
      //     currentPassword: formData.currentPassword,
      //     newPassword: formData.newPassword,
      //   }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.error || "Failed to change password");
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50 mb-6">
        Change Password
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900 dark:text-green-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            required
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            required
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="Enter your new password"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Must be at least 8 characters long
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="Confirm your new password"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

