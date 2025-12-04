import { NextRequest, NextResponse } from "next/server";
import { getCustomerOrder } from "@/lib/shopify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accessToken = request.headers.get("x-access-token");
    // Await params in Next.js 15
    const { id } = await params;
    // Decode the order ID and remove any query parameters
    const orderId = decodeURIComponent(id).split("?")[0];

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching order with ID:", orderId);
    const order = await getCustomerOrder(accessToken, orderId);

    if (!order) {
      console.log("Order not found for ID:", orderId);
      return NextResponse.json(
        { error: "Order not found", orderId: orderId },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch order. Please try again.",
      },
      { status: 500 }
    );
  }
}

