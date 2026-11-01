"use client";

import { CloudOff } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Segment-level error boundary for the opportunities listing. Catches
 * render/runtime failures under /opportunities and shows an on-brand,
 * recoverable message instead of the unstyled global crash page.
 */
export default function OpportunitiesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-md rounded-xl border border-dashed bg-card p-10 text-center">
          <CloudOff aria-hidden="true" className="mx-auto size-10 text-coral" />
          <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground" role="alert">
            The volunteer data could not be loaded right now. Please make sure
            the CommonGround backend is running, then try again.
          </p>
          <Button onClick={reset} variant="outline" className="mt-6">
            Try again
          </Button>
        </div>
      </div>
    </section>
  );
}
