
import Link from "next/link";

import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { Button } from "@/components/ui/button";
import {
  fetchUpcomingOpportunities,
  getApiErrorMessage,
} from "@/lib/opportunities-api";
import type { Opportunity } from "@/data/opportunities";

/**
 * Layout-preserving fallback for the home page while upcoming events stream
 * in from the API. Kept in the same section shape as the loaded content so
 * the page does not jump when data arrives.
 */
export function FeaturedOpportunitiesSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading upcoming events"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div aria-hidden="true" className="max-w-xl">
          <div className="h-9 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-muted" />
        </div>

        <div
          aria-hidden="true"
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border bg-card"
            >
              <div className="aspect-[16/9] w-full animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Home Page upcoming events.
 * Fetches real MongoDB events through the CommonGround API.
 */
export async function FeaturedOpportunities() {
  let opportunities: Opportunity[] = [];
  let errorMessage: string | null = null;

  try {
    opportunities = await fetchUpcomingOpportunities();
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  return (
    <section
      aria-labelledby="featured-heading"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2
              id="featured-heading"
              className="font-heading text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Recent Upcoming Events
            </h2>
            <p className="mt-3 text-muted-foreground">
              Discover upcoming community service events
              created by local organizers. Find a cause
              that matters to you and get involved.
            </p>
          </div>

          <Button
            render={<Link href="/opportunities" />}
            nativeButton={false}
            variant="outline"
            className="hidden sm:inline-flex"
          >
            View all opportunities
          </Button>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="mt-10 rounded-xl border border-border p-8 text-center"
          >
            <p className="text-muted-foreground">
              {errorMessage}
            </p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border p-10 text-center">
            <h3 className="font-heading text-xl font-semibold">
              No upcoming events yet
            </h3>
            <p className="mt-2 text-muted-foreground">
              New community opportunities will appear here
              as soon as organizers create them.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Button
            render={<Link href="/opportunities" />}
            nativeButton={false}
            variant="outline"
          >
            View all opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}
