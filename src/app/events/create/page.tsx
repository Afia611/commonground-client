import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarPlus, Info } from "lucide-react";

import { CreateEventForm } from "@/components/events/create-event-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create Event | CommonGround",
};

/** The proxy only checks cookie presence — validate the real session here. */
export const dynamic = "force-dynamic";

/**
 * Protected Create Event page (B14 Assignment 8). Volunteers with an active
 * BetterAuth session can publish a volunteering event; the backend binds it
 * to their verified identity and the public listing picks it up instantly.
 */
export default async function CreateEventPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?callbackUrl=/events/create");
  }

  const name = session.user?.name ?? "organizer";

  return (
    <section className="flex flex-1 flex-col px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <CalendarPlus aria-hidden="true" className="size-3.5" />
            New opportunity
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Create Event
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Welcome back, {name}. Publish a volunteering event so neighbours can
            find it in the opportunities listing right away.
          </p>
        </div>

        <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <CreateEventForm />
        </div>

        <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>
            You are creating this event as {name}. Only future dates are
            accepted.{" "}
            <Link href="/opportunities" className="font-medium text-primary hover:underline">
              Browse opportunities
            </Link>
          </span>
        </p>
      </div>
    </section>
  );
}
