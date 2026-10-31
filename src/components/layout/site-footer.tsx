import Link from "next/link";

import { Logo } from "@/components/layout/logo";

const footerNav = [
  {
    heading: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Find Opportunities", href: "/opportunities" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
  },
];

/** Site-wide footer with branding, key links, and the copyright notice. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo tone="on-dark" />
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
            CommonGround is a community volunteering platform. Different people,
            shared purpose: find an opportunity near you and lend a hand.
          </p>
        </div>
        {footerNav.map((group) => (
          <nav key={group.heading} aria-label={`${group.heading} links`}>
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              {group.heading}
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-xs text-primary-foreground/90 underline-offset-4 hover:text-primary-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-primary-foreground/15 py-4 text-center text-xs text-primary-foreground/70">
        © {year} CommonGround · Different people. Shared purpose.
      </div>
    </footer>
  );
}
