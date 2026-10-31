import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const favouriteTopics = [
  "Community gardens",
  "Food banks",
  "Youth mentoring",
  "Wildlife clean-ups",
];

/** Top of the landing page: tagline, headline, and the primary actions. */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Decorative circles — the CommonGround meeting motif */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -top-24 -right-16 size-80 rounded-full bg-secondary" />
        <div className="absolute top-28 right-36 size-44 rounded-full bg-coral/20" />
        <div className="absolute -top-10 right-72 size-32 rounded-full bg-primary/10" />
        <div className="absolute top-36 right-56 hidden rotate-3 rounded-full border bg-card px-4 py-1.5 text-xs font-medium shadow-sm lg:block">
          Beach clean-up, Saturday 8:30
        </div>
        <div className="absolute top-72 right-40 hidden -rotate-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium shadow-sm lg:block">
          Community garden, this weekend
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex max-w-2xl flex-col items-start gap-6">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            Different People · Shared Purpose
          </p>
          <h1 className="font-heading text-4xl leading-tight font-semibold text-foreground sm:text-5xl lg:text-6xl">
            Find your people. <span className="text-primary italic">Make a difference.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            CommonGround matches you with local volunteering opportunities — from
            community gardens to youth mentoring. Pick what fits your week, sign up
            in minutes, and meet the people who make your neighbourhood work.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href="/opportunities" />}
              nativeButton={false}
              className="h-12 px-7 text-base"
            >
              Find opportunities
            </Button>
            <Button
              render={<Link href="#how-it-works" />}
              nativeButton={false}
              variant="outline"
              className="h-12 px-7 text-base"
            >
              See how it works
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Popular this season:</span>
            {favouriteTopics.map((topic) => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
