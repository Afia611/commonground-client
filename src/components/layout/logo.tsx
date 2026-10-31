import { cn } from "cn";

type LogoProps = {
  className?: string;
  /**
   * "on-light" fits cream or white backgrounds (the default),
   * "on-dark" fits dark surfaces such as the footer.
   */
  tone?: "on-light" | "on-dark";
};

/**
 * CommonGround wordmark: two overlapping circles, like people meeting
 * on shared ground. Pure SVG so it needs no image assets.
 */
export function Logo({ className, tone = "on-light" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
        <circle
          cx="10"
          cy="10"
          r="7.5"
          className={tone === "on-light" ? "fill-primary" : "fill-primary-foreground"}
        />
        <circle cx="19" cy="10" r="7.5" className="fill-coral opacity-90" />
      </svg>
      <span className="font-heading text-lg font-semibold tracking-tight">
        Common<span className="italic">Ground</span>
      </span>
    </span>
  );
}
