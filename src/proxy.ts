import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

/**
 * Server-side route protection for CommonGround volunteer pages.
 *
 * Next.js 16 runs Proxy on the Node.js runtime, so we can ask BetterAuth to
 * validate the session against MongoDB rather than trusting the presence of a
 * cookie. The cookie alone is only a hint: it can be expired, revoked, or
 * forged. `auth.api.getSession()` verifies the signed session token and
 * returns the current user (or null).
 *
 * This is a fast, additional redirect layer. Every protected page and every
 * Express API call still performs its own authorization check — the proxy is
 * not the security boundary.
 */
export async function proxy(request: NextRequest) {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> = null;

  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch {
    // If the auth store is temporarily unreachable we fail closed and send
    // the visitor to login. The login page itself also re-checks the session,
    // so an expired cookie cannot loop forever.
    session = null;
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/events/create",
    "/events/manage",
    "/events/joined",
    "/profile",
  ],
};
