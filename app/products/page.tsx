import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";

// Function to generate metadata dynamically
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  // Get dynamic title from search params, or use default
  const titleParam = searchParams?.title as string | undefined;
  const categoryParam = searchParams?.category as string | undefined;
  
  // Build dynamic title based on params
  let dynamicTitle = "Products";
  
  if (titleParam) {
    dynamicTitle = titleParam;
  } else if (categoryParam) {
    dynamicTitle = `${categoryParam} Products`;
  } else {
    // Default: fetch product count
    try {
      const products = await getProducts();
      const productCount = products.length;
      dynamicTitle = `Products (${productCount} items)`;
    } catch (error) {
      // Fallback if fetch fails
      dynamicTitle = "Products";
    }
  }
  
  return {
    title: dynamicTitle,
    description: `Discover our wide range of high-quality products${categoryParam ? ` in ${categoryParam}` : ""}`,
  };
}

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getProducts();
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            Our Products
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Discover our wide range of high-quality products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              No products found. Please check your Shopify configuration.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.numericId}`}
                className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {product.name}
                </h3>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
                    {product.price}
                  </span>
                  <button className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

