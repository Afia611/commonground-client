
import Image from "next/image";

const galleryImages = [
  {
    src: "/gallery/cleanup.jpg",
    alt: "Volunteers participating in a community cleanup",
    title: "Cleaner Communities",
  },
  {
    src: "/gallery/plantation.jpg",
    alt: "Volunteers planting trees",
    title: "A Greener Tomorrow",
  },
  {
    src: "/gallery/donation.jpg",
    alt: "Volunteers organizing clothing donations",
    title: "Sharing Warmth",
  },
  {
    src: "/gallery/food-distribution.jpg",
    alt: "Volunteers distributing food to community members",
    title: "Food for Everyone",
  },
  {
    src: "/gallery/volunteers.jpg",
    alt: "Community volunteers working together",
    title: "Stronger Together",
  },
  {
    src: "/gallery/environment.jpg",
    alt: "Volunteers supporting environmental conservation",
    title: "Caring for Our Planet",
  },
];

export function CommunityGallery() {
  return (
    <section
      aria-labelledby="gallery-heading"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Our Community
          </p>

          <h2
            id="gallery-heading"
            className="mt-3 font-heading text-3xl font-semibold sm:text-4xl"
          >
            Community in Action
          </h2>

          <p className="mt-4 text-muted-foreground">
            Every small act of kindness creates a
            ripple of positive change. See how people
            come together to make a difference.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {galleryImages.map((image) => (
            <div
              key={image.src}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-white sm:text-lg">
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
