
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  HeartHandshake,
  Loader2,
  Plus,
  Users,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Opportunity = {
  id: string;
  title: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000"
).replace(/\/+$/, "");

function extractOpportunities(data: unknown): Opportunity[] {
  if (Array.isArray(data)) {
    return data as Opportunity[];
  }

  if (data && typeof data === "object") {
    const value = data as Record<string, unknown>;

    if (Array.isArray(value.opportunities)) {
      return value.opportunities as Opportunity[];
    }

    if (Array.isArray(value.items)) {
      return value.items as Opportunity[];
    }
  }

  throw new Error("Unexpected opportunity response format.");
}

async function fetchProtectedOpportunities(
  path: string,
  token: string,
): Promise<Opportunity[]> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = (await response.json()) as ApiResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ?? "Unable to load opportunities.",
    );
  }

  return extractOpportunities(result.data);
}

export default function DashboardPage() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const userId = session?.user?.id;

  const [createdCount, setCreatedCount] = useState<number | null>(
    null,
  );
  const [joinedCount, setJoinedCount] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!userId) {
      router.replace("/login?callbackUrl=/dashboard");
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error(
            "Unable to verify your session. Please sign in again.",
          );
        }

        const results = await Promise.allSettled([
          fetchProtectedOpportunities(
            "/api/opportunities/mine",
            token,
          ),
          fetchProtectedOpportunities(
            "/api/opportunities/joined",
            token,
          ),
        ]);

        if (cancelled) return;

        const [createdResult, joinedResult] = results;

        if (createdResult.status === "fulfilled") {
          setCreatedCount(createdResult.value.length);
        }

        if (joinedResult.status === "fulfilled") {
          setJoinedCount(joinedResult.value.length);
        }

        const failures = results.filter(
          (result) => result.status === "rejected",
        );

        if (failures.length > 0) {
          setError(
            "Some dashboard statistics could not be loaded. Your events are still accessible below.",
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard statistics.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [isPending, userId, router]);

  if (isPending || !userId) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          className="size-7 animate-spin text-primary"
          aria-label="Loading dashboard"
        />
      </main>
    );
  }

  const firstName =
    session?.user?.name?.trim().split(/\s+/)[0] ?? "Volunteer";

  return (
    <main className="min-h-[70vh]">
      <section className="border-b border-border/60 bg-card/40 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold text-primary">
            Your volunteering space
          </p>

          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Every act of kindness makes a difference. Manage the
            opportunities you organize, follow the causes you
            support, and keep your community moving forward.
          </p>

          <div className="mt-7">
            <Button
              render={<Link href="/events/create" />}
              nativeButton={false}
              className="h-11 bg-coral px-6 text-coral-foreground hover:bg-coral/90"
            >
              <Plus className="mr-2 size-4" />
              Create an event
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Your activity at a glance
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A quick overview of your CommonGround journey.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-6 rounded-lg border border-destructive/30 p-4 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Events created
                  </p>
                  <p className="mt-2 font-heading text-4xl font-semibold">
                    {loading ? "..." : (createdCount ?? "—")}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <CalendarDays className="size-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Events joined
                  </p>
                  <p className="mt-2 font-heading text-4xl font-semibold">
                    {loading ? "..." : (joinedCount ?? "—")}
                  </p>
                </div>
                <div className="rounded-xl bg-coral/10 p-3">
                  <HeartHandshake className="size-6 text-coral" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total activities
                  </p>
                  <p className="mt-2 font-heading text-4xl font-semibold">
                    {loading
                      ? "..."
                      : createdCount !== null &&
                          joinedCount !== null
                        ? createdCount + joinedCount
                        : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <Users className="size-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 mt-14">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Manage your volunteering
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything you need to organize and participate.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarDays className="size-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl">
                  My Created Events
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  Review, edit, and manage the volunteering
                  opportunities you have organized.
                </p>

                <Button
                  render={<Link href="/events/mine" />}
                  nativeButton={false}
                  variant="outline"
                  className="mt-auto w-full justify-between"
                >
                  Manage events
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-coral/10">
                  <HeartHandshake className="size-6 text-coral" />
                </div>
                <CardTitle className="font-heading text-xl">
                  My Joined Events
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  Keep track of your registrations and revisit
                  events you are volunteering for.
                </p>

                <Button
                  render={<Link href="/dashboard/joined" />}
                  nativeButton={false}
                  variant="outline"
                  className="mt-auto w-full justify-between"
                >
                  View joined events
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarPlus className="size-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl">
                  Create New Event
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  Bring people together by organizing a new
                  community service opportunity.
                </p>

                <Button
                  render={<Link href="/events/create" />}
                  nativeButton={false}
                  variant="outline"
                  className="mt-auto w-full justify-between"
                >
                  Create an event
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 rounded-2xl border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold">
              Looking for another way to help?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Discover meaningful volunteering opportunities
              in your community and connect with people who
              share your purpose.
            </p>

            <Button
              render={<Link href="/opportunities" />}
              nativeButton={false}
              className="mt-6 bg-coral text-coral-foreground hover:bg-coral/90"
            >
              Explore opportunities
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
