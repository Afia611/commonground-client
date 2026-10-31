import { CommunityImpact } from "@/components/landing/community-impact";
import { FeaturedOpportunities } from "@/components/landing/featured-opportunities";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedOpportunities />
      <HowItWorks />
      <CommunityImpact />
      <FinalCta />
    </>
  );
}
