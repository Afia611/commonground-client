import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { sanitizeCallbackUrl } from "@/lib/password-policy";

export const metadata: Metadata = {
  title: "Log In | CommonGround",
};

/**
 * Login route. `?callbackUrl=/somewhere` is preserved through sign-in and
 * sign-up so volunteers end up where they were headed (e.g. an opportunity
 * detail page). Already-authenticated visitors are sent straight to it.
 */
export default async function LoginPage({
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
      title="Welcome back"
      subtitle="Log in to find volunteering opportunities near you."
      footer={
        <span>
          New to CommonGround?{" "}
          <Link
            href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </span>
      }
    >
      <LoginForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
