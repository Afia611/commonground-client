import { CalendarDays, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Opportunity } from "@/data/opportunities";

/**
 * Reusable opportunity preview card. Used on the landing page today and
 * ready to be reused on the opportunities listing page later.
 */
export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{opportunity.category}</Badge>
        </CardAction>
        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
        <CardDescription>{opportunity.organization}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
            {opportunity.location}
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-primary" />
            {opportunity.schedule}
          </li>
          <li className="flex items-center gap-2">
            <Users aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <span>
              <span className="font-semibold text-coral">{opportunity.spotsLeft}</span>
              {" of "}
              {opportunity.spotsTotal} places still open
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
