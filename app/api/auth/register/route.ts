import { NextRequest, NextResponse } from "next/server";
import { createCustomer } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Registration request body:", body);
    const { firstName, lastName, email, password, phone, acceptsMarketing } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      console.log("Validation failed - missing fields:", { firstName, lastName, email, password: !!password });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create customer in Shopify
    const customer = await createCustomer({
      firstName,
      lastName,
      email,
      password,
      phone: phone || undefined,
      acceptsMarketing: acceptsMarketing || false,
    });

    return NextResponse.json(
      {
        success: true,
        customer: {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Get more detailed error information
    let errorMessage = "Failed to create account";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check if it's a Shopify GraphQL error
      if (error.message.includes("customerUserErrors") || error.message.includes("TAKEN")) {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 400 }
    );
  }
}

