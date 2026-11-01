
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";

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
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000"
).replace(/\/+$/, "");

export default function MyJoinedEventsPage() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const [events, setEvents] = useState<JoinedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(
        "/login?callbackUrl=/dashboard/joined",
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
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load joined events.",
          );
        }

        if (!cancelled) {
          setEvents(result.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong.",
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
  }, [session?.user, isPending, router]);

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
        <p className="text-muted-foreground">
          Loading your events...
        </p>
      ) : error ? (
        <p role="alert" className="text-destructive">
          {error}
        </p>
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
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id}>
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

                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  {event.location}
                </p>

                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4 shrink-0" />
                  {event.schedule}
                </p>

                <div className="mt-auto pt-3">
                  <Button
                    render={
                      <Link href={`/opportunities/${event.id}`} />
                    }
                    nativeButton={false}
                    variant="outline"
                    className="w-full"
                  >
                    View Event / Leave Event
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
