"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ShopInfo {
  name: string;
  logo: string | null;
}

export default function ShopLogo() {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShopInfo = async () => {
      try {
        const response = await fetch("/api/shop");
        if (response.ok) {
          const data = await response.json();
          setShopInfo(data);
        }
      } catch (error) {
        console.error("Error fetching shop info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShopInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="h-10 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  if (shopInfo?.logo) {
    return (
      <Image
        src={shopInfo.logo}
        alt={shopInfo.name || "Store Logo"}
        width={100}
        height={40}
        priority
        className="h-10 w-auto object-contain"
      />
    );
  }

  return (
    <span className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
      {shopInfo?.name || "Store"}
    </span>
  );
}

