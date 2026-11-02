"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

type ThemeToggleProps = {
  className?: string;
};

/**
 * Accessible light/dark switch for the header and mobile navigation.
 *
 * The first render is deliberately theme-neutral. next-themes resolves the
 * stored/system preference on the client, so waiting until after mount avoids
 * a server/client icon mismatch (and therefore a hydration warning).
 */
const subscribeToHydration = () => () => {};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  // Hydration-safe mount flag without an effect (which would trigger a
  // cascading render and is flagged by the React compiler lint rules).
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      aria-pressed={mounted ? isDark : undefined}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("size-10 text-muted-foreground hover:text-foreground", className)}
    >
      {mounted ? (
        isDark ? (
          <Sun aria-hidden="true" className="size-5" />
        ) : (
          <Moon aria-hidden="true" className="size-5" />
        )
      ) : (
        <span aria-hidden="true" className="size-5" />
      )}
    </Button>
  );
}
