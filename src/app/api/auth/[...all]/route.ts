import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Next.js App Router mount point for every BetterAuth endpoint:
 * /api/auth/sign-up/email, /api/auth/sign-in/email, /api/auth/callback/google,
 * /api/auth/jwks, /api/auth/token, /api/auth/get-session, ...
 */
export const { GET, POST } = toNextJsHandler(auth);
