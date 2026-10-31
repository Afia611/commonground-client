import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Log In | CommonGround",
};

export default function LoginPage() {
  return (
    <PlaceholderPage
      title="Log In"
      description="Account log in with BetterAuth will be added in the authentication milestone."
    />
  );
}
