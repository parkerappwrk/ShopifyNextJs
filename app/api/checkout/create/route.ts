import { NextRequest, NextResponse } from "next/server";
import { createCart, type CartLineItem, type CustomerInfo } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineItems, customerInfo } = body;

    // Validation
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Please add items to your cart." },
        { status: 400 }
      );
    }

    // Validate line items structure
    const validLineItems: CartLineItem[] = lineItems.map((item: any) => {
      if (!item.variantId || !item.quantity) {
        throw new Error("Invalid line item structure. Each item must have variantId and quantity.");
      }
      return {
        merchandiseId: item.variantId, // Shopify uses merchandiseId for variant ID
        quantity: parseInt(item.quantity, 10),
      };
    });

    // Prepare customer info if provided
    let customerData: CustomerInfo | undefined;
    if (customerInfo) {
      customerData = {
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        address1: customerInfo.address1,
        address2: customerInfo.address2,
        city: customerInfo.city,
        province: customerInfo.province,
        zip: customerInfo.zip,
        country: customerInfo.country || "US", // Default to US if not provided
        phone: customerInfo.phone,
      };
    }

    // Create cart in Shopify with customer information
    const cart = await createCart(validLineItems, customerData);

    return NextResponse.json(
      {
        success: true,
        checkout: {
          id: cart.id,
          webUrl: cart.checkoutUrl,
          totalPrice: cart.cost.totalAmount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cart creation error:", error);
    
    let errorMessage = "Failed to create cart";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

