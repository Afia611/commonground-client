/**
 * DNS SRV fallback for Atlas `mongodb+srv://` connections.
 *
 * Some networks refuse SRV record lookups (`querySrv ECONNREFUSED /
 * ETIMEDOUT`), which breaks the MongoDB driver's first connection attempt.
 * The Express backend has the same workaround in `src/config/db.ts`; here we
 * wrap the global `dns.promises.resolve` the driver uses, retrying failed
 * SRV/TXT lookups against public resolvers (Google, then Cloudflare).
 *
 * No credentials involved — DNS records are public.
 */

import dns from "node:dns";

const NETWORK_ERROR = /querySrv|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|ESERVFAIL|EAI_AGAIN|ETIMEOUT/i;

const FALLBACK_DNS_SERVERS: string[][] = [
  ["8.8.8.8", "8.8.4.4"],
  ["1.1.1.1", "1.0.0.1"],
];

let patched = false;

/**
 * Patch `dns.promises.resolve` once per process so SRV/TXT lookups that the
 * OS resolver refuses are retried via public DNS. Pass-through for everything
 * else (including successful lookups and non-parseable record types).
 */
export function patchMongoSrvDns(): void {
  if (patched) return;
  patched = true;

  // Loosely typed to bypass the stdlib's per-rrtype overloads.
  const original = dns.promises.resolve as unknown as (
    hostname: string,
    rrtype?: string,
  ) => Promise<unknown>;

  dns.promises.resolve = (async (hostname: string, rrtype?: string) => {
    try {
      return await original(hostname, rrtype);
    } catch (err) {
      const message = err instanceof Error ? `${err.message} ${String((err as { cause?: unknown }).cause ?? "")}` : "";
      if (!NETWORK_ERROR.test(message) || !rrtype || (rrtype !== "SRV" && rrtype !== "TXT")) {
        throw err;
      }

      // The OS resolver refused the SRV/TXT lookup — retry via public DNS.
      let lastError: unknown = err;
      for (const servers of FALLBACK_DNS_SERVERS) {
        const resolver = new dns.promises.Resolver();
        resolver.setServers(servers);
        try {
          return await resolver.resolve(hostname, rrtype);
        } catch (fallbackErr) {
          lastError = fallbackErr;
        }
      }
      throw lastError;
    }
  }) as typeof dns.promises.resolve;
}
