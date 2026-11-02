
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Final call to action before the footer. */
export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="pb-16 sm:pb-20 lg:pb-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase">
            Different People · Shared Purpose
          </p>

          <h2
            id="final-cta-heading"
            className="font-heading max-w-xl text-3xl font-semibold sm:text-4xl"
          >
            Ready to find your common ground?
          </h2>

          <p className="max-w-md text-primary-foreground/85">
            Browse opportunities near you and sign up today. It is free to view
            and join — you only need to bring yourself.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href="/opportunities" />}
              nativeButton={false}
              className="h-12 bg-coral px-7 text-base font-semibold text-coral-foreground hover:bg-coral/90"
            >
              Find opportunities
            </Button>

            <Button
              render={<Link href="/signup" />}
              nativeButton={false}
              variant="outline"
              className="h-12 border-white bg-white px-7 text-base font-semibold text-[#123524] hover:border-white hover:bg-white/90 hover:text-[#123524] dark:border-white dark:bg-white dark:text-[#123524] dark:hover:border-white dark:hover:bg-white/90 dark:hover:text-[#123524]"
            >
              Create an account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
