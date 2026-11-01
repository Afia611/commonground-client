
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  Mail,
  MapPin,
  Users,
} from "lucide-react";

import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { JoinOpportunityPanel } from "@/components/opportunities/join-opportunity-panel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchOpportunities,
  fetchOpportunity,
  MAX_PAGE_SIZE,
  selectRelatedOpportunities,
} from "@/lib/opportunities-api";
import type { Opportunity } from "@/data/opportunities";

type OpportunityPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: OpportunityPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const opportunity = await fetchOpportunity(id);

    if (opportunity) {
      return {
        title: `${opportunity.title} | CommonGround`,
        description: opportunity.description,
      };
    }
  } catch {
    // Metadata is best-effort.
  }

  return {
    title: "Opportunity not found | CommonGround",
  };
}

function DetailListItems({
  items,
  highlight,
}: {
  items: string[];
  highlight: boolean;
}) {
  return (
    <ul className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          {highlight ? (
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
          ) : (
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-coral"
            />
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}

async function loadRelated(
  opportunity: Opportunity,
): Promise<Opportunity[]> {
  try {
    const all = await fetchOpportunities({
      page: 1,
      limit: MAX_PAGE_SIZE,
    });

    return selectRelatedOpportunities(
      all,
      opportunity,
      2,
    );
  } catch {
    return [];
  }
}

export default async function OpportunityPage({
  params,
}: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = await fetchOpportunity(id);

  if (!opportunity) {
    notFound();
  }

  const related = await loadRelated(opportunity);
  const spotsLeft = opportunity.spotsLeft ?? 0;
  const spotsTotal = opportunity.spotsTotal ?? 0;

  return (
    <>
      <section className="border-b border-border/60 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/opportunities" />}
                >
                  Opportunities
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {opportunity.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
          <div>
            <Badge variant="secondary">
              {opportunity.category}
            </Badge>

            <h1 className="mt-4 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
              {opportunity.title}
            </h1>

            <p className="mt-3 text-lg text-muted-foreground">
              Organized by {opportunity.organization} ·{" "}
              {opportunity.duration}
            </p>

            <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <MapPin className="size-4 shrink-0 text-primary" />
                {opportunity.location}
              </li>

              <li className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <CalendarDays className="size-4 shrink-0 text-primary" />
                {opportunity.schedule}
              </li>

              <li className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <Clock className="size-4 shrink-0 text-primary" />
                {opportunity.duration}
              </li>

              <li className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <Users className="size-4 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold text-coral">
                    {spotsLeft}
                  </span>{" "}
                  of {spotsTotal} places still open
                </span>
              </li>
            </ul>

            <div className="mt-8">
              <h2 className="font-heading text-2xl font-semibold">
                About this opportunity
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {opportunity.description}
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>What you&rsquo;ll do</CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailListItems
                    items={opportunity.responsibilities}
                    highlight={false}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What you&rsquo;ll need</CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailListItems
                    items={opportunity.requirements}
                    highlight={false}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What you&rsquo;ll gain</CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailListItems
                    items={opportunity.benefits}
                    highlight={true}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="mt-10">
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex items-center gap-2 font-medium">
                  <BadgeCheck className="size-5 text-primary" />
                  {opportunity.organizer.name}
                </p>

                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {opportunity.organizer.about}
                </p>

                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0 text-primary" />
                  {opportunity.organizer.contactEmail}
                </p>
              </CardContent>
            </Card>
          </div>

          <aside>
            <JoinOpportunityPanel
              opportunityId={opportunity.id}
              initialSpotsLeft={spotsLeft}
              spotsTotal={spotsTotal}
            />
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="pb-16 sm:pb-20 lg:pb-24"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="related-heading"
                className="font-heading text-2xl font-semibold sm:text-3xl"
              >
                More ways to help
              </h2>

              <Button
                render={<Link href="/opportunities" />}
                nativeButton={false}
                variant="outline"
                className="hidden sm:inline-flex"
              >
                View all opportunities
              </Button>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <OpportunityCard
                  key={item.id}
                  opportunity={item}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
