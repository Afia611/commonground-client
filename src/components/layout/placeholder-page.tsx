import Link from "next/link";

import { Button } from "@/components/ui/button";

type PlaceholderPageProps = {
  /** e.g. "Find Opportunities" */
  title: string;
  /** Short copy explaining what will live here eventually. */
  description: string;
};

/**
 * Simple placeholder page for routes that are linked from the shared
 * layout but will be built in a later milestone. Clearly marked as a
 * placeholder on purpose, so it is never mistaken for a finished page.
 */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-24 sm:px-6">
      <div className="w-full max-w-lg rounded-xl border bg-card p-10 text-center shadow-sm">
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Placeholder route — coming soon
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="outline"
          className="mt-6"
        >
          Back to home
        </Button>
      </div>
    </section>
  );
}
