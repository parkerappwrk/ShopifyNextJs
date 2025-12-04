import type { Metadata } from "next";
import AccountLayout from "@/components/AccountLayout";
import OrderDetail from "@/components/account/OrderDetail";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id}`,
    description: "View your order details",
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  // Decode the order ID and remove any query parameters
  const orderId = decodeURIComponent(id).split("?")[0];
  
  return (
    <AccountLayout>
      <OrderDetail orderId={orderId} />
    </AccountLayout>
  );
}

