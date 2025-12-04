import { NextRequest, NextResponse } from "next/server";
import { getCustomerOrders } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get("x-access-token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const orders = await getCustomerOrders(accessToken, 50);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch orders. Please try again.",
      },
      { status: 500 }
    );
  }
}

