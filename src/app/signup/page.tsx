import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/signup-form";
import { auth } from "@/lib/auth";
import { sanitizeCallbackUrl } from "@/lib/password-policy";

export const metadata: Metadata = {
  title: "Sign Up | CommonGround",
};

/**
 * Registration route. Shares the `?callbackUrl=` handling with /login, and
 * signs the new volunteer straight in (BetterAuth auto sign-in).
 */
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawCallbackUrl = Array.isArray(params.callbackUrl)
    ? params.callbackUrl[0]
    : params.callbackUrl;
  const callbackUrl = sanitizeCallbackUrl(rawCallbackUrl);

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect(callbackUrl);
  }

  return (
    <AuthCard
      title="Join CommonGround"
      subtitle="Create your free account to join community volunteering events."
      footer={
        <span>
          Already have an account?{" "}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium text-primary hover:underline"
          >
            Log in instead
          </Link>
        </span>
      }
    >
      <SignUpForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
