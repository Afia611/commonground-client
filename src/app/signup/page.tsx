import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Sign Up | CommonGround",
};

export default function SignUpPage() {
  return (
    <PlaceholderPage
      title="Sign Up"
      description="Account creation with BetterAuth will be added in the authentication milestone."
    />
  );
}
