import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/products";
import ProductPurchaseSection from "@/components/ProductPurchaseSection";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata dynamically for SEO
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

// Generate static params for all products (optional, for static generation)
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      id: product.numericId.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
                {product.name}
              </h1>
              {product.rating && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating!)
                            ? "text-yellow-400"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <div>
              <p className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
                {product.price}
              </p>
              {product.inStock !== false && (
                <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  In Stock
                </p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                Description
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {product.longDescription || product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  Features
                </h2>
                <ul className="mt-2 space-y-2">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400"
                    >
                      <svg
                        className="mt-1 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Variant Selector and Actions */}
            {product.variants && product.variants.length > 0 ? (
              <ProductPurchaseSection
                variants={product.variants}
                currencyCode={product.currencyCode}
              />
            ) : (
              <>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    This product has no variants available.
                  </p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button className="flex-1 rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">
                    Add to Cart
                  </button>
                  <button className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900">
                    Buy Now
                  </button>
                </div>
              </>
            )}

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Free Shipping
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    30-Day Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

