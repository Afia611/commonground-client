
import { Suspense } from "react";

import { CommunityImpact } from "@/components/landing/community-impact";
import { CommunityGallery } from "@/components/landing/community-gallery";
import {
  FeaturedOpportunities,
  FeaturedOpportunitiesSkeleton,
} from "@/components/landing/featured-opportunities";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Newsletter } from "@/components/landing/newsletter";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<FeaturedOpportunitiesSkeleton />}>
        <FeaturedOpportunities />
      </Suspense>
      <HowItWorks />
      <CommunityImpact />
      <CommunityGallery />
      <Newsletter />
      <FinalCta />
    </>
  );
}
