import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover great products, quick checkout, and a storefront built for speed.",
};

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{k}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {v}
      </p>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 6);
  const heroProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-800/40" />
          <div className="absolute -bottom-40 left-10 h-[420px] w-[420px] rounded-full bg-zinc-200/50 blur-3xl dark:bg-zinc-800/30" />
        </div>

        <div className="container relative mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-black/40 dark:text-zinc-300">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Fast, secure checkout • Modern storefront
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
                A better way to shop—
                <span className="block text-zinc-700 dark:text-zinc-300">
                  curated products, zero friction.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
                Explore products you’ll love, add to cart in seconds, and check out
                with confidence. Built with Shopify + Next.js for speed on every
                device.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="rounded-full bg-zinc-950 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Shop products
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-center text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Talk to us
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat k="Shipping" v="Quick processing" />
                <Stat k="Support" v="Real humans" />
                <Stat k="Payments" v="Secure checkout" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {heroProducts.length > 0 ? (
                    heroProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.numericId}`}
                        className="group relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900"
                      >
                        <div className="relative aspect-square w-full">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3">
                          <p className="truncate text-xs font-semibold text-white">
                            {p.name}
                          </p>
                          <p className="text-xs text-white/80">{p.price}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square w-full rounded-xl bg-zinc-100 dark:bg-zinc-900"
                        />
                      ))}
                    </>
                  )}
                </div>

                <div className="mt-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/40">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        Featured picks, updated regularly
                      </p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Find something new every time you visit.
                      </p>
                    </div>
                    <Link
                      href="/products"
                      className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      View all
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / features */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Shopping that feels effortless
            </h2>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
              Built with performance and clarity in mind—so customers can decide
              faster and check out smoother.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Feature
              title="Clean product details"
              description="Clear pricing, variants, and stock status so customers know exactly what they’re buying."
            />
            <Feature
              title="Cart → checkout in seconds"
              description="Add items quickly and head straight to checkout with minimal steps."
            />
            <Feature
              title="Modern, mobile-first UI"
              description="A polished experience that stays fast on phones, tablets, and desktops."
            />
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Featured products
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                A quick glance at what’s popular right now.
              </p>
            </div>
            <Link
              href="/products"
              className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Browse all products
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              No products found. Check your Shopify configuration to populate the
              homepage.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.numericId}`}
                  className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
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
                  <h3 className="mb-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    {product.name}
                  </h3>
                  <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                      {product.price}
                    </span>
                    <span className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:group-hover:bg-zinc-200">
                      View
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category tiles */}
      <section className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Shop by vibe
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Quick jump-offs to get you browsing faster.
              </p>
            </div>
            <Link
              href="/about"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Learn about us →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { t: "Best sellers", d: "Most-loved picks", href: "/products" },
              { t: "New arrivals", d: "Fresh finds", href: "/products" },
              { t: "Gifts", d: "Easy wins", href: "/products" },
            ].map((tile) => (
              <Link
                key={tile.t}
                href={tile.href}
                className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-900"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-zinc-200/70 blur-2xl dark:bg-zinc-800/50" />
                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {tile.t}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {tile.d}
                </p>
                <p className="mt-4 text-sm font-medium text-zinc-700 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-50">
                  Browse →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-zinc-950 p-8 text-white dark:bg-zinc-50 dark:text-zinc-950 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Ready to find your next favorite?
              </h2>
              <p className="mt-2 text-sm text-white/80 dark:text-zinc-700">
                Start with our featured picks—or browse the full catalog.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800"
              >
                Shop now
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 bg-transparent px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10 dark:border-zinc-950/20 dark:text-zinc-950 dark:hover:bg-zinc-950/5"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
