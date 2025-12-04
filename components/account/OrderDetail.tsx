"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface OrderDetail {
  id: string;
  name: string;
  orderNumber: number;
  createdAt: string;
  totalPrice: string;
  currencyCode: string;
  subtotalPrice: string;
  totalTax: string;
  totalShippingPrice: string;
  fulfillmentStatus: string;
  financialStatus: string;
  shippingAddress?: {
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
  } | null;
  billingAddress?: {
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
  } | null;
  lineItems: Array<{
    title: string;
    quantity: number;
    price: string;
    currencyCode: string;
    image?: string;
    variantTitle?: string;
  }>;
}

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const accessToken =
          typeof window !== "undefined"
            ? localStorage.getItem("shopifyAccessToken")
            : null;

        if (!accessToken) {
          setError("Please log in to view order details");
          setIsLoading(false);
          return;
        }

        // Decode and clean the order ID (remove any query parameters)
        const cleanOrderId = decodeURIComponent(orderId).split("?")[0];
        const response = await fetch(`/api/account/orders/${encodeURIComponent(cleanOrderId)}`, {
          headers: {
            "x-access-token": accessToken,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Order not found");
          } else if (response.status === 401) {
            setError("Please log in to view order details");
          } else {
            setError("Failed to load order details");
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatAddress = (address: OrderDetail["shippingAddress"]) => {
    if (!address) return "N/A";
    const parts = [
      address.address1,
      address.address2,
      `${address.city}, ${address.province} ${address.zip}`,
      address.country,
    ].filter(Boolean);
    return parts.join("\n");
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-zinc-600 dark:text-zinc-400">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <div className="mb-6">
          <Link
            href="/account/orders"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Orders
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 dark:text-red-400 mb-4">{error || "Order not found"}</div>
          <Link
            href="/account/orders"
            className="inline-block rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/account/orders"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to Orders
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Order #{order.orderNumber} ({order.name})
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Items */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-4">
            Order Items
          </h3>
          <div className="space-y-4">
            {order.lineItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0">
                {item.image && (
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-950 dark:text-zinc-50">
                    {item.title}
                  </p>
                  {item.variantTitle && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                      {item.variantTitle}
                    </p>
                  )}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-zinc-950 dark:text-zinc-50 whitespace-nowrap">
                  {item.currencyCode} {parseFloat(item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-4">
              Order Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Fulfillment Status:
                </span>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {order.fulfillmentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Payment Status:
                </span>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {order.financialStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Subtotal:</span>
                <span className="text-zinc-950 dark:text-zinc-50">
                  {order.currencyCode} {parseFloat(order.subtotalPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Shipping:</span>
                <span className="text-zinc-950 dark:text-zinc-50">
                  {order.currencyCode} {parseFloat(order.totalShippingPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Tax:</span>
                <span className="text-zinc-950 dark:text-zinc-50">
                  {order.currencyCode} {parseFloat(order.totalTax).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-950 dark:text-zinc-50">Total:</span>
                  <span className="font-bold text-lg text-zinc-950 dark:text-zinc-50">
                    {order.currencyCode} {parseFloat(order.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-4">
                Shipping Address
              </h3>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                {"\n"}
                {formatAddress(order.shippingAddress)}
                {order.shippingAddress.phone && (
                  <>
                    {"\n"}Phone: {order.shippingAddress.phone}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Billing Address */}
          {order.billingAddress && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-4">
                Billing Address
              </h3>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                {order.billingAddress.firstName} {order.billingAddress.lastName}
                {"\n"}
                {formatAddress(order.billingAddress)}
                {order.billingAddress.phone && (
                  <>
                    {"\n"}Phone: {order.billingAddress.phone}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

