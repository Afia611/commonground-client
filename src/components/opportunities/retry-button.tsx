"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

/**
 * Small client island that re-runs the server component tree, re-fetching
 * API data. Used by the error panel for an explicit "try again" action.
 */
export function RetryButton({ label = "Try again" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.refresh()}
      variant="outline"
      className="mt-6"
    >
      {label}
    </Button>
  );
}
