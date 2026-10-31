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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getOpportunityById,
  getRelatedOpportunities,
  opportunities,
} from "@/data/opportunities";

type OpportunityPageProps = {
  params: Promise<{ id: string }>;
};

/** Pre-render the six sample opportunities at build time. */
export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ id: opportunity.id }));
}

export async function generateMetadata({
  params,
}: OpportunityPageProps): Promise<Metadata> {
  const { id } = await params;
  const opportunity = getOpportunityById(id);
  if (!opportunity) {
    return { title: "Opportunity not found | CommonGround" };
  }
  return {
    title: `${opportunity.title} | CommonGround`,
    description: opportunity.description,
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

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = getOpportunityById(id);
  if (!opportunity) {
    notFound();
  }

  const spotsFilled = opportunity.spotsTotal - opportunity.spotsLeft;
  const percentFilled = Math.round((spotsFilled / opportunity.spotsTotal) * 100);
  const related = getRelatedOpportunities(opportunity.id, 2);

  return (
    <>
      <section className="border-b border-border/60 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/opportunities" />}>
                  Opportunities
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{opportunity.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
          <div>
            <Badge variant="secondary">{opportunity.category}</Badge>
            <h1 className="mt-4 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
              {opportunity.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Organized by {opportunity.organization} · {opportunity.duration}
            </p>

            <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
                {opportunity.location}
              </li>
              <li className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-primary" />
                {opportunity.schedule}
              </li>
              <li className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <Clock aria-hidden="true" className="size-4 shrink-0 text-primary" />
                {opportunity.duration}
              </li>
              <li className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <Users aria-hidden="true" className="size-4 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold text-coral">
                    {opportunity.spotsLeft}
                  </span>{" "}
                  of {opportunity.spotsTotal} places still open
                </span>
              </li>
            </ul>

            <div className="mt-8">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
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

            {/* Organizer */}
            <Card className="mt-10">
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex items-center gap-2 font-medium text-foreground">
                  <BadgeCheck aria-hidden="true" className="size-5 text-primary" />
                  {opportunity.organizer.name}
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {opportunity.organizer.about}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-primary" />
                  {opportunity.organizer.contactEmail}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sign-up panel */}
          <aside>
            <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
              <div>
                <p className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">Places still open</span>
                  <span className="font-semibold text-foreground">
                    {opportunity.spotsLeft}/{opportunity.spotsTotal}
                  </span>
                </p>
                <div
                  role="img"
                  aria-label={`${percentFilled} percent of ${opportunity.spotsTotal} places are filled`}
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {spotsFilled} of {opportunity.spotsTotal} places already taken
                </p>
              </div>

              <Button
                render={<Link href={`/login?callbackUrl=/opportunities/${opportunity.id}`} />}
                nativeButton={false}
                className="h-12 bg-coral text-base text-coral-foreground hover:bg-coral/90"
              >
                Join this opportunity
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                You will be asked to log in first, then brought back here.
              </p>
              <Button
                render={<Link href="/opportunities" />}
                nativeButton={false}
                variant="outline"
                className="h-12 text-base"
              >
                Back to all opportunities
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {/* Related opportunities */}
      <section aria-labelledby="related-heading" className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="related-heading"
              className="font-heading text-2xl font-semibold text-foreground sm:text-3xl"
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
            {related.map((relatedOpportunity) => (
              <OpportunityCard
                key={relatedOpportunity.id}
                opportunity={relatedOpportunity}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
