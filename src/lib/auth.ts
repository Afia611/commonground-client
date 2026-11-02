/**
 * CommonGround BetterAuth server configuration.
 *
 * Supports:
 * - MongoDB Atlas authentication
 * - Email/password registration and login
 * - Google OAuth (when configured)
 * - Password policy validation
 * - JWT authentication for the Express backend
 * - Local and production trusted origins
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

// Retry MongoDB Atlas SRV DNS lookups where needed.
patchMongoSrvDns();

// Local development and production configuration.
const BASE_URL =
  process.env.BETTER_AUTH_URL?.trim() ||
  "http://localhost:3000";

const PRODUCTION_URL =
  "https://commonground-client-tau.vercel.app";

// Validate required environment variables.
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "BETTER_AUTH_SECRET is required. Set it in your environment variables.",
  );
}

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is required for BetterAuth.",
  );
}

/**
 * Reuse the MongoDB connection across Next.js hot reloads.
 */
function withMongoDb<T>(
  fn: (mongo: {
    client: MongoClient;
    db: ReturnType<MongoClient["db"]>;
  }) => T,
): T {
  const store = globalThis as unknown as {
    __cgAuthMongoClient?: MongoClient;
  };

  if (!store.__cgAuthMongoClient) {
    const client = new MongoClient(
      process.env.MONGODB_URI as string,
      {
        serverSelectionTimeoutMS: 10_000,
        connectTimeoutMS: 10_000,
      },
    );

    store.__cgAuthMongoClient = client;
  }

  const client = store.__cgAuthMongoClient;

  return fn({
    client,
    db: client.db(process.env.DB_NAME ?? "commonground"),
  });
}

/**
 * Enable Google authentication only when credentials exist.
 */
const socialProviders = {} as Record<string, unknown>;

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

/**
 * BetterAuth configuration.
 */
export const auth = betterAuth({
  baseURL: BASE_URL,

  // Allow requests from local development and the deployed frontend.
  trustedOrigins: [
  "http://localhost:3000",
  "https://commonground-client-tau.vercel.app",
  ...(process.env.VERCEL_URL
    ? [`https://${process.env.VERCEL_URL}`]
    : []),
],

  secret: process.env.BETTER_AUTH_SECRET,

  database: withMongoDb(({ client, db }) =>
    mongodbAdapter(db, { client }),
  ),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: 128,
  },

  socialProviders,

  advanced: {
    database: {
      joins: true,
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = (
          ctx.body as { password?: unknown } | undefined
        )?.password;

        if (typeof password !== "string") {
          throw new APIError("BAD_REQUEST", {
            message: "A password is required.",
          });
        }

        const policyError =
          validatePasswordPolicy(password);

        if (policyError) {
          throw new APIError("BAD_REQUEST", {
            message: policyError,
          });
        }
      }
    }),
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
      },
    }),

    // Keep this plugin last.
    nextCookies(),
  ],
});