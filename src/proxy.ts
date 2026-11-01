import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic route protection for CommonGround volunteer/admin pages.
 *
 * The BetterAuth session cookie is only checked for presence here — this is
 * the officially recommended pattern for fast redirects; it is NOT a
 * security boundary. Every protected page re-validates the session
 * server-side (auth.api.getSession) before rendering anything.
 *
 * Next.js 16 renamed middleware to proxy; the `middleware()` function is now
 * `proxy()` (see src/app docs in node_modules/next/dist/docs).
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the intended destination so login can send the user back.
    const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/events/create", "/events/manage", "/events/joined"],
};
