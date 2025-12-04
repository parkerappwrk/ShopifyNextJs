"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Order {
  id: string;
  name: string;
  orderNumber: number;
  createdAt: string;
  totalPrice: string;
  currencyCode: string;
  fulfillmentStatus: string;
  financialStatus: string;
  lineItems: Array<{
    title: string;
    quantity: number;
    price: string;
    currencyCode: string;
    image?: string;
    variantTitle?: string;
  }>;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get access token from localStorage
        const accessToken =
          typeof window !== "undefined"
            ? localStorage.getItem("shopifyAccessToken")
            : null;

        if (!accessToken) {
          setOrders([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/account/orders", {
          headers: {
            "x-access-token": accessToken,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // User not logged in
            setOrders([]);
            setIsLoading(false);
            return;
          }
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-zinc-600 dark:text-zinc-400">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50 mb-6">
          My Orders
        </h2>
        <div className="text-center py-12">
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
          <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            No orders yet
          </h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            When you place an order, it will appear here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50 mb-6">
        My Orders
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  Order #{order.orderNumber} ({order.name})
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  {order.currencyCode} {parseFloat(order.totalPrice).toFixed(2)}
                </p>
                <div className="flex gap-2 mt-1 justify-end">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {order.fulfillmentStatus}
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {order.financialStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {order.lineItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  {item.image && (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-zinc-950 dark:text-zinc-50">
                      {item.title}
                    </p>
                    {item.variantTitle && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-500">
                        {item.variantTitle}
                      </p>
                    )}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-zinc-950 dark:text-zinc-50">
                    {item.currencyCode} {parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Link
                href={`/account/orders/${encodeURIComponent(order.id)}`}
                className="text-sm font-medium text-zinc-950 hover:text-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-200"
              >
                View Order Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

