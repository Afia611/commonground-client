import Link from "next/link";

import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { Button } from "@/components/ui/button";
import { featuredOpportunities } from "@/data/opportunities";

/** Featured opportunities, drawn from the shared sample data file. */
export function FeaturedOpportunities() {
  return (
    <section aria-labelledby="featured-heading" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2
              id="featured-heading"
              className="font-heading text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Find your kind of good
            </h2>
            <p className="mt-3 text-muted-foreground">
              A quick sample of what is happening near you right now. Every
              opportunity is run by a local organiser — you just bring yourself.
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Button render={<Link href="/opportunities" />} nativeButton={false} variant="outline">
            View all opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}
