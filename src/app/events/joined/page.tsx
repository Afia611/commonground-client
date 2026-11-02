import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Joined Events | CommonGround",
};

/** Proxy only checks the real session; this page re-validates server-side. */
export const dynamic = "force-dynamic";

/**
 * Legacy /events/joined entry point. The joined-events experience now lives
 * at /dashboard/joined; keep the old URL working for bookmarks and links.
 */
export default async function JoinedEventsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?callbackUrl=/events/joined");
  }

  redirect("/dashboard/joined");
}
