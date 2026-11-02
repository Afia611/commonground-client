import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/profile-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Your Profile | CommonGround",
  description:
    "View and update your CommonGround name and profile picture.",
};

/** The proxy checks the real session; this page re-validates it server-side. */
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="text-sm font-semibold text-primary">
          Your account
        </p>

        <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
          Your profile
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Update the name and photo other volunteers see when you organise or
          join a community event.
        </p>
      </header>

      <ProfileForm
        initialName={session.user.name ?? ""}
        initialImage={session.user.image ?? ""}
        email={session.user.email}
      />
    </main>
  );
}
