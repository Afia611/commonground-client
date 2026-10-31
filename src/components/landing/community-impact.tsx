import { HandHeart, Sprout, Users } from "lucide-react";

const impactPoints = [
  {
    icon: HandHeart,
    title: "Real help, where it counts",
    description:
      "Volunteers give their time exactly where a local project needs it — no guesswork, no wasted Saturdays.",
  },
  {
    icon: Users,
    title: "Neighbours, not strangers",
    description:
      "Sign-ups put you shoulder to shoulder with people who live nearby, so friendships form while the work gets done.",
  },
  {
    icon: Sprout,
    title: "Projects that keep growing",
    description:
      "Regular volunteers let organisers plan ahead with confidence, from re-stocking the food bank to replanting the garden.",
  },
];

/**
 * Community impact section. Deliberately states what volunteering does
 * rather than quoting invented statistics.
 */
export function CommunityImpact() {
  return (
    <section aria-labelledby="impact-heading" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="impact-heading"
            className="font-heading text-3xl font-semibold text-foreground sm:text-4xl"
          >
            It starts with one person showing up
          </h2>
          <p className="mt-6 font-heading text-xl leading-relaxed text-primary italic">
            “When people show up for each other, a neighbourhood starts to
            feel like home.”
          </p>
          <p className="mt-4 text-muted-foreground">
            That is the whole idea behind CommonGround. We do not promise you a
            life story in a single afternoon — just a place to be useful, with
            people who will notice you came.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {impactPoints.map((point) => (
            <li
              key={point.title}
              className="flex flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm"
            >
              <point.icon aria-hidden="true" className="size-6 text-coral" />
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
