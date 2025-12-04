import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AccountLayout from "@/components/AccountLayout";
import PersonalDetails from "@/components/account/PersonalDetails";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account settings and view your orders",
};

export default function AccountPage() {
  // This will be handled client-side for auth check
  return (
    <AccountLayout>
      <PersonalDetails />
    </AccountLayout>
  );
}

