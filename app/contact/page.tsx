import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with questions about products, orders, or support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
              We’re here to help
            </h1>
            <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-400">
              Have a question about a product or your order? Send us a message and
              we’ll respond as soon as possible.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Details */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  Contact details
                </h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="font-medium text-zinc-950 dark:text-zinc-50">
                      Email
                    </dt>
                    <dd className="mt-1 text-zinc-600 dark:text-zinc-400">
                      <a
                        href="mailto:support@example.com"
                        className="hover:text-zinc-950 dark:hover:text-zinc-50"
                      >
                        support@example.com
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-zinc-950 dark:text-zinc-50">
                      Phone
                    </dt>
                    <dd className="mt-1 text-zinc-600 dark:text-zinc-400">
                      <a
                        href="tel:+10000000000"
                        className="hover:text-zinc-950 dark:hover:text-zinc-50"
                      >
                        +1 (000) 000-0000
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-zinc-950 dark:text-zinc-50">
                      Hours
                    </dt>
                    <dd className="mt-1 text-zinc-600 dark:text-zinc-400">
                      Mon–Fri, 9am–5pm
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/40">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    Need faster help?
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    If it’s about an order, include your order number.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/account/orders"
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                    >
                      View orders
                    </Link>
                    <Link
                      href="/products"
                      className="rounded-full bg-zinc-950 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      Browse products
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  Send a message
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  We typically respond within 1–2 business days.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Prefer email? Write us directly at{" "}
            <a
              href="mailto:support@example.com"
              className="font-medium hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              support@example.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}


