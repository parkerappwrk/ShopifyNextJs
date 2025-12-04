import type { Metadata } from "next";
import AccountLayout from "@/components/AccountLayout";
import ChangePassword from "@/components/account/ChangePassword";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your account password",
};

export default function ChangePasswordPage() {
  return (
    <AccountLayout>
      <ChangePassword />
    </AccountLayout>
  );
}

