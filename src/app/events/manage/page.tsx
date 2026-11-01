
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ManageEvents } from "@/components/events/manage-events";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Manage Events | CommonGround",
};

export const dynamic = "force-dynamic";

export default async function ManageEventsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/events/manage");
  }

  return (
    <section className="flex flex-1 flex-col px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Your community impact
          </span>

          <h1 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Manage Events
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View, update, and manage the volunteering events you&apos;ve created.
          </p>
        </div>

        <ManageEvents />
      </div>
    </section>
  );
}
