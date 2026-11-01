/**
 * BetterAuth server instance (Next.js route handlers + server components).
 *
 * - MongoDB (Atlas) via the official BetterAuth MongoDB adapter; the same
 *   database as the Express backend, but the auth system itself lives here.
 * - Email/password registration and sign-in with the CommonGround password
 *   policy enforced server-side (>= 6 chars, upper + lower case).
 * - Google social login when GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set.
 * - JWT plugin: exposes /api/auth/jwks and /api/auth/token so the Express
 *   backend can verify BetterAuth-issued JWTs with jose (no shared secret).
 *
 * Secrets come from environment variables only (see .env.example).
 * This module must only be imported from server code.
 */

import { APIError, betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import {
  PASSWORD_MIN_LENGTH,
  validatePasswordPolicy,
} from "@/lib/password-policy";
import { patchMongoSrvDns } from "@/lib/mongo-dns-fallback";

// Atlas SRV lookups fail on some networks — let the driver retry via public DNS.
patchMongoSrvDns();

const BASE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "BETTER_AUTH_SECRET is required. Copy .env.example to .env.local and set it (e.g. `openssl rand -hex 32`).",
  );
}

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is required for BetterAuth. Copy .env.example to .env.local and set it.",
  );
}

/**
 * Shared singleton MongoClient so Next.js dev-server hot reloads reuse one
 * connection pool instead of leaking clients.
 */
function withMongoDb<T>(fn: (mongo: { client: MongoClient; db: ReturnType<MongoClient["db"]> }) => T): T {
  const store = globalThis as unknown as { __cgAuthMongoClient?: MongoClient };
  if (!store.__cgAuthMongoClient) {
    const client = new MongoClient(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
    });
    store.__cgAuthMongoClient = client;
  }
  const client = store.__cgAuthMongoClient as MongoClient;
  return fn({ client, db: client.db(process.env.DB_NAME ?? "commonground") });
}

/** CommonGround password policy lives in src/lib/password-policy.ts and is
 * enforced here server-side on every sign-up (and mirrored in the client). */

/** Only include Google when both credentials are configured. */
const socialProviders = {} as Record<string, unknown>;
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  baseURL: BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: withMongoDb(({ client, db }) => mongodbAdapter(db, { client })),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: 128,
  },
  socialProviders,
  advanced: {
    database: {
      // MongoDB Atlas (sharded cluster) supports adapter-level joins.
      joins: true,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Enforce the full password policy on the server, not just the client.
      if (ctx.path === "/sign-up/email") {
        const password = (ctx.body as { password?: unknown } | undefined)?.password;
        if (typeof password !== "string") {
          throw new APIError("BAD_REQUEST", { message: "A password is required." });
        }
        const policyError = validatePasswordPolicy(password);
        if (policyError) {
          throw new APIError("BAD_REQUEST", { message: policyError });
        }
      }
    }),
  },
  plugins: [
    // Issues JWTs (RS-verified via JWKS) for the Express backend.
    jwt({
      jwt: {
        expirationTime: "1h",
      },
    }),
    // Must stay last: lets route handlers/server actions set auth cookies.
    nextCookies(),
  ],
});
