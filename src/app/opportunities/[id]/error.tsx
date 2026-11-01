"use client";

import { CloudOff } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Segment-level error boundary for opportunity detail pages. When the
 * backend is unreachable (or a render fails), visitors get an on-brand,
 * recoverable message instead of the unstyled global crash page.
 */
export default function OpportunityDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <div className="max-w-md rounded-xl border border-dashed bg-card p-10">
        <CloudOff aria-hidden="true" className="mx-auto size-10 text-coral" />
        <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
          Could not load this opportunity
        </h1>
        <p className="mt-2 text-sm text-muted-foreground" role="alert">
          The volunteer API is unreachable right now. Please make sure the
          CommonGround backend is running, then try again.
        </p>
        <Button onClick={reset} variant="outline" className="mt-6">
          Try again
        </Button>
      </div>
    </section>
  );
}
