
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Opportunity } from "@/data/opportunities";

/**
 * Fallback images for different event categories.
 * These images are stored in public/gallery/.
 */
const CATEGORY_IMAGES: Record<string, string> = {
  Cleanup: "/gallery/cleanup.jpg",
  Plantation: "/gallery/plantation.jpg",
  Donation: "/gallery/donation.jpg",
  Education: "/gallery/volunteers.jpg",
  "Community Care": "/gallery/food-distribution.jpg",
  Environment: "/gallery/environment.jpg",
  Other: "/gallery/volunteers.jpg",
};

const DEFAULT_IMAGE = "/gallery/volunteers.jpg";

/**
 * Get the event's thumbnail or its category fallback.
 */
function getEventImage(opportunity: Opportunity): string {
  const imageUrl = opportunity.imageUrl?.trim();

  if (imageUrl) {
    return imageUrl;
  }

  return CATEGORY_IMAGES[opportunity.category] ?? DEFAULT_IMAGE;
}

/**
 * Format the event date for display.
 */
function formatEventDate(opportunity: Opportunity): string {
  if (!opportunity.eventDate) {
    return opportunity.schedule;
  }

  const date = new Date(opportunity.eventDate);

  if (Number.isNaN(date.getTime())) {
    return opportunity.schedule;
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Reusable opportunity card for Home and Upcoming Events.
 */
export function OpportunityCard({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  const imageUrl = getEventImage(opportunity);
  const eventDate = formatEventDate(opportunity);

  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      aria-label={`View event: ${opportunity.title}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="flex h-full flex-col overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Event thumbnail */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={`${opportunity.title} event thumbnail`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Event type badge */}
          <div className="absolute left-4 top-4">
            <Badge className="bg-background/95 text-foreground shadow-sm hover:bg-background">
              {opportunity.category}
            </Badge>
          </div>
        </div>

        {/* Event information */}
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
            {opportunity.title}
          </CardTitle>

          {opportunity.organization && (
            <CardDescription className="line-clamp-1">
              {opportunity.organization}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex flex-1 flex-col pb-5">
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            {/* Location */}
            <li className="flex items-start gap-2">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span className="line-clamp-2">
                {opportunity.location}
              </span>
            </li>

            {/* Event date */}
            <li className="flex items-center gap-2">
              <CalendarDays
                aria-hidden="true"
                className="size-4 shrink-0 text-primary"
              />
              <span>{eventDate}</span>
            </li>

            {/* Available volunteer spots */}
            <li className="flex items-center gap-2">
              <Users
                aria-hidden="true"
                className="size-4 shrink-0 text-primary"
              />
              <span>
                <span className="font-semibold text-coral">
                  {opportunity.spotsLeft}
                </span>{" "}
                of {opportunity.spotsTotal} places still open
              </span>
            </li>
          </ul>

          {/* View Event action */}
          <div className="mt-auto pt-6">
            <div className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-coral font-medium text-coral-foreground transition-colors group-hover:bg-coral/90">
              View Event
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
