import { NextRequest, NextResponse } from "next/server";
import { deleteCustomerAccessToken } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    // Delete access token from Shopify
    await deleteCustomerAccessToken(accessToken);

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to logout",
      },
      { status: 400 }
    );
  }
}

