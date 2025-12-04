import { NextRequest, NextResponse } from "next/server";
import { getCustomer } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get("x-access-token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }

    // Get customer details from Shopify
    const customer = await getCustomer(accessToken);

    if (!customer) {
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        customer: {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to get customer",
      },
      { status: 401 }
    );
  }
}

