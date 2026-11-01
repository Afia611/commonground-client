import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PlaceholderPage } from "@/components/layout/placeholder-page";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create Event | CommonGround",
};

/** Proxy only checks cookie presence — validate the real session here. */
export const dynamic = "force-dynamic";

export default async function CreateEventPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?callbackUrl=/events/create");
  }

  return (
    <PlaceholderPage
      title="Create Event"
      description="You are logged in. Organizing a new volunteering event arrives in an upcoming milestone."
    />
  );
}
