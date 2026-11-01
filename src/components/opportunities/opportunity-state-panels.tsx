import Link from "next/link";
import { CloudOff, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RetryButton } from "@/components/opportunities/retry-button";

/**
 * Layout-preserving loading skeleton shown while API data is streaming in.
 * Uses the same grid as the results grid so the page doesn't jump.
 */
export function OpportunitiesListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-xl border bg-muted/60"
        />
      ))}
    </div>
  );
}

/** Detailed-page skeleton mirroring the two-column detail layout. */
export function OpportunityDetailSkeleton() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div aria-hidden="true" className="flex flex-col gap-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-11 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="mt-4 h-28 animate-pulse rounded-lg bg-muted" />
        </div>
        <div
          aria-hidden="true"
          className="h-72 animate-pulse self-start rounded-xl border bg-muted/60 lg:sticky lg:top-24 lg:w-80"
        />
      </div>
    </section>
  );
}

/** API failure panel — shown instead of data; never silently falls back. */
export function ApiErrorPanel({ message }: { message: string }) {
  const isUnreachable = message.startsWith("Cannot reach");

  return (
    <div className="mt-6 rounded-xl border border-dashed bg-card p-10 text-center">
      <CloudOff
        aria-hidden="true"
        className="mx-auto size-10 text-coral"
      />
      <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
        {isUnreachable ? "The volunteer API is unreachable" : "Could not load opportunities"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground" role="alert">
        {message} Please make sure the CommonGround backend is running, then try again.
      </p>
      <RetryButton />
    </div>
  );
}

/** API reachable but the collection is empty — distinct from an error. */
export function EmptyOpportunitiesPanel() {
  return (
    <div className="mt-6 rounded-xl border border-dashed bg-card p-10 text-center">
      <Inbox aria-hidden="true" className="mx-auto size-10 text-primary" />
      <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
        No opportunities published yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        The CommonGround volunteer list is empty right now. Check back soon —
        new community events are on the way.
      </p>
      <Button render={<Link href="/" />} nativeButton={false} variant="outline" className="mt-6">
        Back to home
      </Button>
    </div>
  );
}
