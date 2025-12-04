import { NextResponse } from "next/server";
import { getShopInfo } from "@/lib/shopify";

export async function GET() {
  try {
    const shop = await getShopInfo();
    
    // Get store logo from environment variable if available, otherwise null
    const storeLogo = process.env.STORE_LOGO_URL || null;
    
    return NextResponse.json({
      name: shop.name,
      logo: storeLogo,
    });
  } catch (error) {
    console.error("Error fetching shop info:", error);
    // Return fallback values if Shopify query fails
    const storeName = process.env.STORE_NAME || "Store";
    const storeLogo = process.env.STORE_LOGO_URL || null;
    
    return NextResponse.json({
      name: storeName,
      logo: storeLogo,
    });
  }
}

