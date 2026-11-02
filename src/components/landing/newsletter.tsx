
"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16 lg:px-16">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/15">
              <Mail className="h-6 w-6" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] opacity-80">
              Stay Connected
            </p>

            <h2
              id="newsletter-heading"
              className="mt-3 font-heading text-3xl font-semibold sm:text-4xl"
            >
              Good things are happening.
              <br />
              Be part of them.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed opacity-85 sm:text-base">
              Discover inspiring community stories, volunteering
              opportunities, and meaningful ways to make a
              difference — all in one place.
            </p>

            <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white/50"
              />

              <button
                type="button"
                disabled
                title="Newsletter subscriptions are coming soon"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-gray-900 opacity-75"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-xs opacity-70">
              Newsletter subscriptions are coming soon.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-white/15"
          />
        </div>
      </div>
    </section>
  );
}
