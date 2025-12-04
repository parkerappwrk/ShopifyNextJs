import { NextRequest, NextResponse } from "next/server";
import {
  createCustomerAccessToken,
  getCustomer,
} from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create access token
    const accessToken = await createCustomerAccessToken(email, password);

    // Get customer details
    const customer = await getCustomer(accessToken.accessToken);

    if (!customer) {
      return NextResponse.json(
        { error: "Failed to retrieve customer information" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        accessToken: accessToken.accessToken,
        expiresAt: accessToken.expiresAt,
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
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid email or password",
      },
      { status: 401 }
    );
  }
}

