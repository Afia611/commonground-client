"use client";

/**
 * BetterAuth client bound to this app's own /api/auth route handlers.
 *
 * `useSession` keeps the navbar/session state reactive and persistent
 * (the session lives in a signed, httpOnly cookie set by the server).
 * `jwtClient` exposes `authClient.token()` to obtain JWKS-verifiable JWTs
 * for authenticated calls to the Express backend (see src/lib/api-auth.ts).
 */

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [jwtClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
