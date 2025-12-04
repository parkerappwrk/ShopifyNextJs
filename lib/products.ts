import { getAllProducts, getProductById as getShopifyProductById, getProductByHandle as getShopifyProductByHandle, type ShopifyProduct } from "./shopify";

// Variant interface
export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  price: string;
  compareAtPrice: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image: string | null;
  weight: number | null;
  weightUnit: string;
}

// Product interface matching our app structure
export interface Product {
  id: string;
  numericId: number; // For backward compatibility with existing routes
  name: string;
  price: string;
  image: string;
  description: string;
  longDescription?: string;
  features?: string[];
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  handle: string;
  currencyCode: string;
  images?: string[]; // Multiple images
  variants?: ProductVariant[]; // All product variants
}

// Transform Shopify product to our Product interface
function transformShopifyProduct(shopifyProduct: ShopifyProduct, index: number): Product {
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const currencyCode = shopifyProduct.priceRange.minVariantPrice.currencyCode;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(price);

  const mainImage = shopifyProduct.images.edges[0]?.node?.url || "/next.svg";
  const allImages = shopifyProduct.images.edges.map((edge) => edge.node.url);

  const isAvailable = shopifyProduct.variants.edges.some(
    (edge) => edge.node.availableForSale
  );

  // Extract description and long description
  const description = shopifyProduct.description || "No description available.";
  const descriptionParts = description.split("\n\n");
  const shortDescription = descriptionParts[0] || description;
  const longDescription = descriptionParts.length > 1 ? descriptionParts.join("\n\n") : description;

  // Transform variants
  const variants: ProductVariant[] = shopifyProduct.variants.edges.map((edge) => {
    const variant = edge.node;
    const variantPrice = parseFloat(variant.price.amount);
    const formattedVariantPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: variant.price.currencyCode,
    }).format(variantPrice);

    const formattedCompareAtPrice = variant.compareAtPrice
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: variant.compareAtPrice.currencyCode,
        }).format(parseFloat(variant.compareAtPrice.amount))
      : null;

    return {
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      price: formattedVariantPrice,
      compareAtPrice: formattedCompareAtPrice,
      availableForSale: variant.availableForSale,
      quantityAvailable: variant.quantityAvailable,
      selectedOptions: variant.selectedOptions,
      image: variant.image?.url || null,
      weight: variant.weight,
      weightUnit: variant.weightUnit,
    };
  });

  return {
    id: shopifyProduct.id,
    numericId: index + 1, // For backward compatibility
    name: shopifyProduct.title,
    price: formattedPrice,
    image: mainImage,
    images: allImages,
    description: shortDescription,
    longDescription: longDescription,
    handle: shopifyProduct.handle,
    currencyCode: currencyCode,
    inStock: isAvailable,
    variants: variants,
    // Optional: You can add rating and reviews if you have them in Shopify
    // rating: 4.5,
    // reviews: 128,
  };
}

// Fetch all products from Shopify
export async function getProducts(): Promise<Product[]> {
  try {
    const shopifyProducts = await getAllProducts(50);
    return shopifyProducts.map((product, index) => transformShopifyProduct(product, index));
  } catch (error) {
    console.error("Error fetching products from Shopify:", error);
    // Return empty array on error - you might want to show an error message to users
    return [];
  }
}

// Get product by numeric ID (for backward compatibility with existing routes)
export async function getProductById(id: number | string): Promise<Product | undefined> {
  try {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    
    // If it's a valid numeric ID, fetch all products and get by index
    if (!isNaN(numericId) && numericId > 0) {
      const products = await getProducts();
      return products.find((p) => p.numericId === numericId);
    }
    
    // Otherwise, try to get by Shopify ID or handle
    const shopifyProduct = await getShopifyProductById(id.toString());
    if (shopifyProduct) {
      return transformShopifyProduct(shopifyProduct, 0);
    }
    
    return undefined;
  } catch (error) {
    console.error("Error fetching product from Shopify:", error);
    return undefined;
  }
}

// Get product by handle (Shopify's URL-friendly identifier)
export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  try {
    const shopifyProduct = await getShopifyProductByHandle(handle);
    if (shopifyProduct) {
      return transformShopifyProduct(shopifyProduct, 0);
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching product by handle from Shopify:", error);
    return undefined;
  }
}

