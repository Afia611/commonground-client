import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Find Opportunities | CommonGround",
};

export default function OpportunitiesPage() {
  return (
    <PlaceholderPage
      title="Find Opportunities"
      description="Browsing and filtering all volunteering opportunities will be built in an upcoming milestone."
    />
  );
}
