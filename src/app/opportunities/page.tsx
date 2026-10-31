import type { Metadata } from "next";

import { OpportunitiesBrowser } from "@/components/opportunities/opportunities-browser";
import {
  getOpportunityCategories,
  getOpportunityCities,
  opportunities,
} from "@/data/opportunities";

export const metadata: Metadata = {
  title: "Explore Opportunities | CommonGround",
};

export default function OpportunitiesPage() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            Explore Opportunities
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
            Find your place to make a difference
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse volunteering across Bangladesh — search by what matters to you,
            filter by cause and city, and see exactly how many places are still open
            before you sign up. Every listing is a demo sample prepared for
            CommonGround.
          </p>
        </header>

        <OpportunitiesBrowser
          opportunities={opportunities}
          categories={getOpportunityCategories()}
          cities={getOpportunityCities()}
        />
      </div>
    </section>
  );
}
