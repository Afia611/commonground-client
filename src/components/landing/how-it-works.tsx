import { ClipboardCheck, HandHeart, Search } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Browse opportunities near you. Filter by cause, day, and distance to find a role that fits your life — no commitments, just possibilities.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Sign up",
    description:
      "Found a fit? Reserve your place in a couple of clicks. The organiser gets your details instantly and can say hello before you arrive.",
  },
  {
    number: "03",
    icon: HandHeart,
    title: "Show up",
    description:
      "Turn up with comfortable shoes and good cheer. Every session is led by a local organiser who knows the project inside out.",
  },
];

/** Three-step explainer, reachable via the hero's "See how it works" anchor. */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-20 bg-secondary/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl font-semibold text-foreground sm:text-4xl"
          >
            How CommonGround works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three steps between good intentions and real impact.
          </p>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="font-heading text-2xl font-semibold text-coral"
                >
                  {step.number}
                </span>
                <step.icon aria-hidden="true" className="size-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
