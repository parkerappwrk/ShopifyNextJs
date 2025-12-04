"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductVariant } from "@/lib/products";

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  currencyCode: string;
  onVariantChange?: (variant: ProductVariant | null) => void;
  onQuantityChange?: (quantity: number) => void;
}

export default function ProductVariantSelector({
  variants,
  currencyCode,
  onVariantChange,
  onQuantityChange,
}: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.find((v) => v.availableForSale) || variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  // Group variants by options (e.g., Size, Color)
  const optionGroups: Record<string, string[]> = {};
  
  variants.forEach((variant) => {
    variant.selectedOptions?.forEach((option) => {
      if (!optionGroups[option.name]) {
        optionGroups[option.name] = [];
      }
      if (!optionGroups[option.name].includes(option.value)) {
        optionGroups[option.name].push(option.value);
      }
    });
  });

  const handleOptionSelect = (optionName: string, optionValue: string) => {
    // Find variant that matches all selected options
    const currentSelections: Record<string, string> = {};
    
    // Get current selections from selected variant
    selectedVariant?.selectedOptions?.forEach((opt) => {
      currentSelections[opt.name] = opt.value;
    });
    
    // Update the selection
    currentSelections[optionName] = optionValue;
    
    // Find matching variant
    const matchingVariant = variants.find((variant) => {
      if (!variant.selectedOptions || variant.selectedOptions.length === 0) {
        return false;
      }
      
      return variant.selectedOptions.every(
        (opt) => currentSelections[opt.name] === opt.value
      );
    });

    if (matchingVariant && matchingVariant.availableForSale) {
      setSelectedVariant(matchingVariant);
      setQuantity(1); // Reset quantity when variant changes
      onVariantChange?.(matchingVariant);
      onQuantityChange?.(1);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const getAvailableOptions = (optionName: string, optionValue: string) => {
    // Check if this option value is available in any variant
    return variants.some((variant) => {
      if (!variant.availableForSale) return false;
      const option = variant.selectedOptions?.find((opt) => opt.name === optionName);
      return option?.value === optionValue;
    });
  };

  return (
    <div className="space-y-6">
      {/* Option Selectors */}
      {Object.keys(optionGroups).length > 0 && (
        <div className="space-y-4">
          {Object.entries(optionGroups).map(([optionName, optionValues]) => (
            <div key={optionName}>
              <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
                {optionName}
                {selectedVariant?.selectedOptions?.find((opt) => opt.name === optionName) && (
                  <span className="ml-2 text-zinc-600 dark:text-zinc-400 font-normal">
                    ({selectedVariant.selectedOptions.find((opt) => opt.name === optionName)?.value})
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {optionValues.map((value) => {
                  const isSelected =
                    selectedVariant?.selectedOptions?.find(
                      (opt) => opt.name === optionName
                    )?.value === value;
                  const isAvailable = getAvailableOptions(optionName, value);

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleOptionSelect(optionName, value)}
                      disabled={!isAvailable}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                          : isAvailable
                          ? "border-zinc-200 bg-white text-zinc-950 hover:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-50"
                          : "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Variant Display */}
      {selectedVariant && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  {selectedVariant.title}
                </h3>
                {selectedVariant.availableForSale ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  {selectedVariant.price}
                </span>
                {selectedVariant.compareAtPrice && (
                  <span className="text-sm text-zinc-500 line-through dark:text-zinc-500">
                    {selectedVariant.compareAtPrice}
                  </span>
                )}
              </div>
              {selectedVariant.sku && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  SKU: {selectedVariant.sku}
                </p>
              )}
            </div>
            {selectedVariant.image && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <Image
                  src={selectedVariant.image}
                  alt={selectedVariant.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-lg border border-zinc-200 bg-white text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              handleQuantityChange(Math.min(Math.max(1, val), 99));
            }}
            className="w-20 text-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 99}
            className="w-10 h-10 rounded-lg border border-zinc-200 bg-white text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            +
          </button>
        </div>
        {selectedVariant?.quantityAvailable !== null && selectedVariant.quantityAvailable !== undefined && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
            {selectedVariant.quantityAvailable} available in stock
          </p>
        )}
      </div>
    </div>
  );
}

