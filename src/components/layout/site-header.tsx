"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarCheck, CalendarPlus, ClipboardList, LogOut, Menu } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

/** Initials for the avatar fallback when a profile photo is missing. */
function initials(name?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const eventMenuItems = [
  { label: "Create Event", href: "/events/create", icon: CalendarPlus },
  { label: "Manage Events", href: "/events/manage", icon: ClipboardList },
  { label: "Joined Events", href: "/events/joined", icon: CalendarCheck },
];

/**
 * Responsive site navigation. Logged out it shows Log in / Sign up;
 * logged in it shows the profile photo (hover reveals the display name)
 * with a dropdown linking to Create/Manage/Joined Events and Logout.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;

  async function handleLogout() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.add({
          type: "error",
          title: "Could not log you out",
          description: error.message || "Please try again.",
        });
        return;
      }
      toast.add({
        type: "success",
        title: "Logged out",
        description: "See you soon — thanks for volunteering with CommonGround!",
      });
      router.push("/");
      router.refresh();
    } catch {
      toast.add({
        type: "error",
        title: "Network error",
        description: "Could not reach the authentication service. Please try again.",
      });
    }
  }

  const profileMenu = user ? (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                aria-label={`Account menu for ${(user.name ?? "member")}`}
                className="size-10 rounded-full p-0.5"
              />
            }
          >
            <Avatar className="size-9">
              {user.image ? <AvatarImage src={user.image} alt={`${user.name ?? "Member"}'s profile photo`} /> : null}
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {/* Hovering over the picture reveals the display name. */}
            {user.name ?? "CommonGround member"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate">{user.name ?? "CommonGround member"}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {eventMenuItems.map((item) => (
          <DropdownMenuItem
            key={item.href}
            render={<Link href={item.href} />}
          >
            <item.icon aria-hidden="true" className="size-4 text-primary" />
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut aria-hidden="true" className="size-4 text-coral" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

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
          {user ? (
            profileMenu
          ) : sessionPending ? (
            <span aria-hidden="true" className="size-9 animate-pulse rounded-full bg-muted" />
          ) : (
            <>
              <Button render={<Link href="/login" />} nativeButton={false} variant="ghost">
                Log in
              </Button>
              <Button render={<Link href="/signup" />} nativeButton={false}>
                Sign up
              </Button>
            </>
          )}
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
              {user
                ? eventMenuItems.map((item) => (
                    <SheetClose
                      key={item.href}
                      nativeButton={false}
                      render={<Link className={navLinkClasses(isActive(pathname, item.href))} href={item.href} />}
                    >
                      {item.label}
                    </SheetClose>
                  ))
                : null}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t pt-4">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-9">
                      {user.image ? <AvatarImage src={user.image} alt={`${user.name ?? "Member"}'s profile photo`} /> : null}
                      <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-medium text-foreground">{user.name}</span>
                  </div>
                  <Button onClick={handleLogout} variant="outline">
                    <LogOut aria-hidden="true" />
                    Log out
                  </Button>
                </div>
              ) : (
                <>
                  <SheetClose render={<Button nativeButton={false} variant="outline" render={<Link href="/login" />} />}>
                    Log in
                  </SheetClose>
                  <SheetClose render={<Button nativeButton={false} render={<Link href="/signup" />} />}>
                    Sign up
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
