import type { Metadata } from "next";
import AccountLayout from "@/components/AccountLayout";
import MyOrders from "@/components/account/MyOrders";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history",
};

export default function OrdersPage() {
  return (
    <AccountLayout>
      <MyOrders />
    </AccountLayout>
  );
}

