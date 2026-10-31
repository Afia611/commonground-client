import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Shown when visiting /opportunities/[id] with an id that has no matching
 * opportunity (for example after a typo or an expired link).
 */
export default function OpportunityNotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
        Not Found
      </p>
      <h1 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
        This opportunity could not be found
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        It may have been a temporary demo listing that is no longer published, or
        the link might contain a small typo. The listing page always shows what is
        currently open for volunteers.
      </p>
      <Button
        render={<Link href="/opportunities" />}
        nativeButton={false}
        className="mt-8"
      >
        Explore opportunities
      </Button>
    </section>
  );
}
