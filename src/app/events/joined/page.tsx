import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PlaceholderPage } from "@/components/layout/placeholder-page";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Joined Events | CommonGround",
};

/** Proxy only checks cookie presence — validate the real session here. */
export const dynamic = "force-dynamic";

export default async function JoinedEventsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?callbackUrl=/events/joined");
  }

  return (
    <PlaceholderPage
      title="Joined Events"
      description="You are logged in. Your registered volunteering events arrive in an upcoming milestone."
    />
  );
}
