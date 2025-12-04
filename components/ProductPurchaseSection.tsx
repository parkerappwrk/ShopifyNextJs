"use client";

import { useState, useEffect } from "react";
import type { ProductVariant } from "@/lib/products";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductActions from "./ProductActions";

interface ProductPurchaseSectionProps {
  variants: ProductVariant[];
  currencyCode: string;
}

export default function ProductPurchaseSection({
  variants,
  currencyCode,
}: ProductPurchaseSectionProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.find((v) => v.availableForSale) || variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  // Update selected variant when variants change
  useEffect(() => {
    if (!selectedVariant || !variants.find((v) => v.id === selectedVariant.id)) {
      const availableVariant = variants.find((v) => v.availableForSale) || variants[0] || null;
      setSelectedVariant(availableVariant);
    }
  }, [variants, selectedVariant]);

  const handleAddToCart = (variant: ProductVariant, qty: number) => {
    // This will be called from ProductActions
    // The cart context will handle adding to cart
  };

  const handleBuyNow = (variant: ProductVariant, qty: number) => {
    // This will be called from ProductActions
    // You can redirect to checkout here
    console.log("Buy now:", { variant, quantity: qty });
    
    // Example: Redirect to checkout
    // window.location.href = `/checkout?variant=${variant.id}&quantity=${qty}`;
  };

  return (
    <>
      <ProductVariantSelector
        variants={variants}
        currencyCode={currencyCode}
        onVariantChange={(variant) => {
          setSelectedVariant(variant);
          setQuantity(1); // Reset quantity when variant changes
        }}
        onQuantityChange={(qty) => {
          setQuantity(qty);
        }}
      />
      <ProductActions
        selectedVariant={selectedVariant}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </>
  );
}

