
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, RefreshCw } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type JoinedOpportunity = {
  id: string;
  title: string;
  category: string;
  location: string;
  schedule: string;
  organization: string;
  imageUrl?: string | null;
  eventDate?: string | null;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000"
).replace(/\/+$/, "");

const CATEGORY_IMAGES: Record<string, string> = {
  Cleanup: "/gallery/cleanup.jpg",
  Plantation: "/gallery/plantation.jpg",
  Donation: "/gallery/donation.jpg",
  Education: "/gallery/volunteers.jpg",
  "Community Care": "/gallery/food-distribution.jpg",
  Environment: "/gallery/environment.jpg",
  Other: "/gallery/volunteers.jpg",
};

function getEventImage(event: JoinedOpportunity): string {
  const imageUrl = event.imageUrl?.trim();

  if (imageUrl) {
    return imageUrl;
  }

  return (
    CATEGORY_IMAGES[event.category] ??
    "/gallery/volunteers.jpg"
  );
}

function formatEventDate(event: JoinedOpportunity): string {
  if (!event.eventDate) {
    return event.schedule;
  }

  const date = new Date(event.eventDate);

  if (Number.isNaN(date.getTime())) {
    return event.schedule;
  }

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function JoinedEventsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading your joined events"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="overflow-hidden rounded-xl border bg-card"
        >
          <div className="aspect-[16/10] w-full animate-pulse bg-muted" />
          <div className="space-y-3 p-6">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyJoinedEventsPage() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const [events, setEvents] = useState<JoinedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(
        "/login?callbackUrl=/dashboard/joined"
      );
      return;
    }

    let cancelled = false;

    async function loadEvents() {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error("Unable to verify your session.");
        }

        const response = await fetch(
          `${API_URL}/api/opportunities/joined`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load joined events."
          );
        }

        if (!cancelled) {
          setEvents(
            Array.isArray(result.data) ? result.data : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, [session?.user, isPending, router, reloadKey]);

  return (
    <main className="mx-auto min-h-[65vh] w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">
          My volunteering
        </p>

        <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
          My Joined Events
        </h1>

        <p className="mt-3 text-muted-foreground">
          View and manage the opportunities you have joined.
        </p>
      </div>

      {loading || isPending ? (
        <JoinedEventsSkeleton />
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-10">
            <h2 className="font-heading text-xl font-semibold">
              Could not load your joined events
            </h2>
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setError("");
                setLoading(true);
                setReloadKey((key) => key + 1);
              }}
            >
              <RefreshCw aria-hidden="true" className="mr-2 size-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-10">
            <h2 className="font-heading text-xl font-semibold">
              No joined events yet
            </h2>

            <p className="text-muted-foreground">
              Explore opportunities and join a cause that matters to you.
            </p>

            <Button
              render={<Link href="/opportunities" />}
              nativeButton={false}
              className="bg-coral text-coral-foreground hover:bg-coral/90"
            >
              Explore opportunities
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden p-0"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={getEventImage(event)}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <CardContent className="flex h-full flex-col gap-4 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {event.category}
                </p>

                <h2 className="font-heading text-xl font-semibold">
                  {event.title}
                </h2>

                <p className="text-sm text-muted-foreground">
                  Organized by {event.organization}
                </p>

                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  {event.location}
                </p>

                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="mt-0.5 size-4 shrink-0" />
                  {formatEventDate(event)}
                </p>

                <div className="mt-auto pt-3">
                  <Button
                    render={
                      <Link
                        href={`/opportunities/${event.id}`}
                      />
                    }
                    nativeButton={false}
                    variant="outline"
                    className="w-full"
                  >
                    View event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
