import Link from "next/link";

import { Logo } from "@/components/layout/logo";

/**
 * Shared card shell for the login/signup pages — cream background, warm
 * off-white card, forest-green headings, matching the CommonGround design.
 */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            aria-label="CommonGround — home"
            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo />
          </Link>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mt-7">{children}</div>

        {footer ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        ) : null}
      </div>
    </section>
  );
}
