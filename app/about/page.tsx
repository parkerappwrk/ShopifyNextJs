import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about our story, what we value, and how we build great shopping experiences.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            About Us
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            Built for simple, delightful shopping
          </h1>
          <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-400">
            We’re a modern storefront focused on great products, fast fulfillment,
            and support that actually helps. Every detail is designed to make
            buying online feel effortless.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { k: "Fast shipping", v: "Quick processing and reliable delivery" },
            { k: "Secure checkout", v: "Trusted payment and privacy practices" },
            { k: "Real support", v: "Friendly help when you need it" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                {item.k}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {item.v}
              </p>
            </div>
          ))}
        </div>

        {/* Story + Values */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Our story
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              This store started with a simple goal: make it easier to find
              quality products without the noise. We focus on clear product
              information, smooth checkout, and a storefront that stays fast on
              every device.
            </p>
            <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              As we grow, we keep the same promise—great products, fair pricing,
              and customer-first support.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              What we value
            </h2>
            <ul className="mt-4 space-y-4">
              {[
                {
                  t: "Quality over quantity",
                  d: "We prioritize products that deliver real value.",
                },
                {
                  t: "Transparency",
                  d: "Clear pricing, clear policies, no surprises.",
                },
                {
                  t: "Speed",
                  d: "A fast site and fast fulfillment—always improving.",
                },
              ].map((v) => (
                <li key={v.t} className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/40">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {v.t}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {v.d}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-12 max-w-5xl rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            FAQs
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                q: "Where do you ship?",
                a: "Shipping availability depends on your location and the items in your cart.",
              },
              {
                q: "How can I track my order?",
                a: "After purchase, you’ll be able to view your order details in your account when available.",
              },
              {
                q: "Can I return an item?",
                a: "Return eligibility varies by product. Contact us and we’ll help you with next steps.",
              },
              {
                q: "Need help choosing a product?",
                a: "Send us a note with what you’re looking for—we’ll recommend options.",
              },
            ].map((f) => (
              <div key={f.q}>
                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {f.q}
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


