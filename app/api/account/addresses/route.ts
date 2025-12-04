import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "@/lib/shopify";

// GET - Fetch customer addresses
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get("x-access-token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }

    const addresses = await getCustomerAddresses(accessToken);

    return NextResponse.json(
      {
        success: true,
        addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to get addresses",
      },
      { status: 400 }
    );
  }
}

// POST - Create a new address
export async function POST(request: NextRequest) {
  try {
    const accessToken = request.headers.get("x-access-token");
    const body = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }

    const address = await createCustomerAddress(accessToken, body);

    return NextResponse.json(
      {
        success: true,
        address,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create address",
      },
      { status: 400 }
    );
  }
}

// PUT - Update an address
export async function PUT(request: NextRequest) {
  try {
    const accessToken = request.headers.get("x-access-token");
    const body = await request.json();
    const { id, ...addressData } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    const address = await updateCustomerAddress(accessToken, id, addressData);

    return NextResponse.json(
      {
        success: true,
        address,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update address",
      },
      { status: 400 }
    );
  }
}

// DELETE - Delete an address
export async function DELETE(request: NextRequest) {
  try {
    const accessToken = request.headers.get("x-access-token");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    await deleteCustomerAddress(accessToken, id);

    return NextResponse.json(
      {
        success: true,
        message: "Address deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete address",
      },
      { status: 400 }
    );
  }
}

