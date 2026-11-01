import type { Metadata } from "next";
import { Suspense } from "react";

import { OpportunitiesBrowser } from "@/components/opportunities/opportunities-browser";
import {
  ApiErrorPanel,
  EmptyOpportunitiesPanel,
  OpportunitiesListSkeleton,
} from "@/components/opportunities/opportunity-state-panels";
import {
  fetchOpportunities,
  getApiErrorMessage,
  MAX_PAGE_SIZE,
} from "@/lib/opportunities-api";
import type { Opportunity } from "@/data/opportunities";

export const metadata: Metadata = {
  title: "Explore Opportunities | CommonGround",
};

/**
 * Opportunity data lives behind the CommonGround API, so the listing is
 * rendered per request. The Suspense boundary keeps the header responsive
 * while data streams in, and the skeleton preserves the layout.
 */
export const dynamic = "force-dynamic";

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
            before you sign up.
          </p>
        </header>

        <Suspense fallback={<OpportunitiesListSkeleton />}>
          <OpportunitiesListContent />
        </Suspense>
      </div>
    </section>
  );
}

/**
 * Server-side data loading for the listing. Errors are surfaced as an
 * explicit retry panel — sample data is never shown as a silent fallback.
 */
async function OpportunitiesListContent() {
  let opportunities: Opportunity[] = [];
  let errorMessage: string | null = null;

  try {
    // One request for the full (capped) listing; filtering stays client-side
    // to preserve the original instant search and filter behaviour.
    opportunities = await fetchOpportunities({ page: 1, limit: MAX_PAGE_SIZE });
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  if (errorMessage) {
    return <ApiErrorPanel message={errorMessage} />;
  }

  if (opportunities.length === 0) {
    return <EmptyOpportunitiesPanel />;
  }

  // Derive filter options from the live data (dev sample data used the same shape).
  const categories = [...new Set(opportunities.map((o) => o.category))];
  const cities = [...new Set(opportunities.map((o) => o.city))];

  return (
    <OpportunitiesBrowser
      opportunities={opportunities}
      categories={categories}
      cities={cities}
    />
  );
}
