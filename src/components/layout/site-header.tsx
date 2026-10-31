"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "cn";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Opportunities", href: "/opportunities" },
];

/** Exact match for the home route, prefix match for section routes. */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function navLinkClasses(active: boolean) {
  return cn(
    "rounded-full px-3 py-1.5 text-sm transition-colors",
    active
      ? "bg-secondary font-medium text-secondary-foreground"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
  );
}

/**
 * Responsive site navigation. Desktop shows inline links plus the
 * log in / sign up buttons; mobile collapses everything into a Sheet.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="CommonGround — home"
          className="rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={navLinkClasses(isActive(pathname, link.href))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button render={<Link href="/login" />} nativeButton={false} variant="ghost">
            Log in
          </Button>
          <Button render={<Link href="/signup" />} nativeButton={false}>
            Sign up
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                aria-label="Open navigation menu"
                className="size-10 md:hidden"
              />
            }
          >
            <Menu aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="w-80 px-6 py-6">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            </SheetHeader>
            <Logo />
            <nav aria-label="Main navigation" className="mt-2 flex flex-col items-start gap-1">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={<Link className={navLinkClasses(isActive(pathname, link.href))} href={link.href} />}
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t pt-4">
              <SheetClose render={<Button nativeButton={false} variant="outline" render={<Link href="/login" />} />}>
                Log in
              </SheetClose>
              <SheetClose render={<Button nativeButton={false} render={<Link href="/signup" />} />}>
                Sign up
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
