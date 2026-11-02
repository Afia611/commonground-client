
import Link from "next/link";
import { ArrowUpRight, HeartHandshake } from "lucide-react";

import { Logo } from "@/components/layout/logo";

const footerNav = [
  {
    heading: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Upcoming Events", href: "/opportunities" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Create an Event", href: "/events/create" },
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Logo tone="on-dark" />

            <p className="mt-4 max-w-sm text-sm leading-7 text-primary-foreground/80">
              Different people. Shared purpose.
              <br />
              Bringing communities together through
              meaningful volunteering opportunities.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-4 py-2 text-xs font-medium text-primary-foreground/90">
              <HeartHandshake
                className="size-4"
                aria-hidden="true"
              />
              Small actions. Meaningful impact.
            </div>
          </div>

          {/* Footer navigation */}
          {footerNav.map((group) => (
            <nav
              key={group.heading}
              aria-label={`${group.heading} links`}
            >
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
                {group.heading}
              </h2>

              <ul className="mt-4 flex flex-col gap-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1 text-primary-foreground/80 transition-colors hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {link.label}
                      <ArrowUpRight
                        className="size-3 opacity-60"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-primary-foreground/70 sm:flex-row sm:px-6 sm:text-left">
          <p>© {year} CommonGround. All rights reserved.</p>
          <p>Different people. Shared purpose.</p>
        </div>
      </div>
    </footer>
  );
}
