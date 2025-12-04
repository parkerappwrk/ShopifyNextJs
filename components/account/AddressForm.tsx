"use client";

import { useState, useEffect } from "react";

interface Address {
  id: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isDefault: boolean;
}

interface AddressFormProps {
  address?: Address | null;
  onClose: () => void;
  onSuccess: (address: Address) => void;
}

export default function AddressForm({
  address,
  onClose,
  onSuccess,
}: AddressFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "US",
    phone: "",
  });

  useEffect(() => {
    // Load user data for default values
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setFormData((prev) => ({
            ...prev,
            firstName: user.firstName || prev.firstName,
            lastName: user.lastName || prev.lastName,
            phone: user.phone || prev.phone,
          }));
        } catch (e) {
          // Invalid user data
        }
      }
    }

    // If editing, load address data
    if (address) {
      setFormData({
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        province: address.province,
        zip: address.zip,
        country: address.country,
        phone: address.phone || "",
      });
    }
  }, [address]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("shopifyAccessToken");
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      const addressData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address1: formData.address1,
        address2: formData.address2 || undefined,
        city: formData.city,
        province: formData.province,
        zip: formData.zip,
        country: formData.country,
        phone: formData.phone || undefined,
      };

      let response;
      if (address) {
        // Update existing address
        response = await fetch("/api/account/addresses", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": accessToken,
          },
          body: JSON.stringify({
            id: address.id,
            ...addressData,
          }),
        });
      } else {
        // Create new address
        response = await fetch("/api/account/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": accessToken,
          },
          body: JSON.stringify(addressData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save address");
      }

      onSuccess(data.address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            {address ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <svg
              className="h-6 w-6"
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
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="address1"
              required
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
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                State / Province *
              </label>
              <input
                type="text"
                name="province"
                required
                value={formData.province}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                ZIP / Postal Code *
              </label>
              <input
                type="text"
                name="zip"
                required
                value={formData.zip}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="US"
              />
            </div>
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

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {isSaving ? "Saving..." : address ? "Update Address" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

