"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddressForm from "./AddressForm";

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

export default function PersonalDetails() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // Load user data and addresses
    const loadData = async () => {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        const accessToken = localStorage.getItem("shopifyAccessToken");

        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setFormData({
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.email || "",
              phone: user.phone || "",
            });
          } catch (e) {
            // Invalid user data
          }
        }

        // Load addresses from Shopify
        if (accessToken) {
          try {
            setIsLoading(true);
            const response = await fetch("/api/account/addresses", {
              headers: {
                "x-access-token": accessToken,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setAddresses(data.addresses || []);
            }
          } catch (error) {
            console.error("Error loading addresses:", error);
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Update customer in Shopify via API
      // For now, we'll update localStorage
      const accessToken = localStorage.getItem("shopifyAccessToken");
      
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      // Update user data in localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        ...formData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // In a real app, you would call an API to update the customer in Shopify
      // await fetch("/api/account/update", { ... });

      setSuccess("Personal details updated successfully!");
      
      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50 mb-6">
        Personal Details
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              placeholder="John"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className="w-full rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Email cannot be changed. Contact support if you need to update it.
          </p>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Address Management Section */}
      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Saved Addresses
          </h3>
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowAddressForm(true);
            }}
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            + Add Address
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
            Loading addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              No saved addresses. Add your first address to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="relative rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                {address.isDefault && (
                  <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Default
                  </span>
                )}
                <div className="pr-20">
                  <p className="font-semibold text-zinc-950 dark:text-zinc-50">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {address.address1}
                    {address.address2 && `, ${address.address2}`}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {address.city}, {address.province} {address.zip}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {address.country}
                  </p>
                  {address.phone && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {address.phone}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingAddress(address);
                      setShowAddressForm(true);
                    }}
                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          "Are you sure you want to delete this address?"
                        )
                      ) {
                        try {
                          const accessToken =
                            localStorage.getItem("shopifyAccessToken");
                          if (!accessToken) {
                            throw new Error("Not authenticated");
                          }

                          const response = await fetch(
                            `/api/account/addresses?id=${address.id}`,
                            {
                              method: "DELETE",
                              headers: {
                                "x-access-token": accessToken,
                              },
                            }
                          );

                          if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || "Failed to delete");
                          }

                          // Remove from local state
                          setAddresses(
                            addresses.filter((a) => a.id !== address.id)
                          );
                          setSuccess("Address deleted successfully");
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : "Failed to delete address"
                          );
                        }
                      }
                    }}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Address Form Modal */}
        {showAddressForm && (
          <AddressForm
            address={editingAddress}
            onClose={() => {
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
            onSuccess={(newAddress) => {
              if (editingAddress) {
                // Update existing address in list
                setAddresses(
                  addresses.map((a) =>
                    a.id === editingAddress.id ? newAddress : a
                  )
                );
              } else {
                // Add new address to list
                setAddresses([...addresses, newAddress]);
              }
              setShowAddressForm(false);
              setEditingAddress(null);
              setSuccess(
                editingAddress
                  ? "Address updated successfully!"
                  : "Address added successfully!"
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

