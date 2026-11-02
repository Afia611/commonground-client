import { OpportunityDetailSkeleton } from "@/components/opportunities/opportunity-state-panels";

/**
 * Streamed fallback for /opportunities/[id]. Mirrors the real detail layout
 * so the breadcrumb, two-column content and join panel do not shift.
 */
export default function LoadingOpportunity() {
  return <OpportunityDetailSkeleton />;
}
