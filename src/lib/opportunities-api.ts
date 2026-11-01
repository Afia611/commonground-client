/**
 * Reusable API client for the CommonGround Express backend.
 *
 * Server components call `fetchOpportunities()` / `fetchOpportunity()` to read
 * public data from GET /api/opportunities and GET /api/opportunities/:id.
 *
 * The base URL comes from `NEXT_PUBLIC_API_URL` (.env.local) and falls back to
 * the local development backend, so the site still runs during development
 * without extra configuration.
 */

import type { Opportunity } from "@/data/opportunities";

const DEFAULT_API_URL = "http://localhost:5000";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL
).replace(/\/+$/, "");

/** Deterministic request timeout so a hung backend can never freeze a render. */
const REQUEST_TIMEOUT_MS = 10_000;

/** Upper page size the backend accepts for a single list request. */
export const MAX_PAGE_SIZE = 50;

/** Thrown for API failures with a meaningful HTTP status (or 0 if unreachable). */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Human-friendly, non-sensitive message for UI error panels. */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return "Cannot reach the CommonGround backend right now.";
    }
    if (error.status >= 500) {
      return "The CommonGround backend hit an unexpected error.";
    }
    return error.message;
  }
  return "Something went wrong while loading opportunities.";
}

/**
 * Validate that a fetched record actually looks like an opportunity.
 * Protects the UI from silently rendering garbage on schema drift.
 */
function isOpportunityLike(value: unknown): value is Opportunity {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { id?: unknown; title?: unknown }).id === "string" &&
    typeof (value as { title?: unknown }).title === "string" &&
    ((value as { title?: unknown }).title as string).trim() !== ""
  );
}

async function apiRequest(path: string): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
  } catch {
    // Network failure, DNS failure, or timeout — reported the same way.
    throw new ApiError(0, "Cannot reach the CommonGround backend right now.");
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `The backend responded with HTTP ${response.status} for ${path}.`,
    );
  }

  return response;
}

export interface FetchOpportunitiesParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export function buildOpportunitiesPath(params: FetchOpportunitiesParams = {}): string {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.category) search.set("category", params.category);
  if (params.search) search.set("search", params.search);
  const query = search.toString();
  return `/api/opportunities${query ? `?${query}` : ""}`;
}

/**
 * Fetch a page of opportunities. Returns the list in API order.
 * Throws ApiError on unreachable backend or non-2xx response.
 */
export async function fetchOpportunities(
  params: FetchOpportunitiesParams = {},
): Promise<Opportunity[]> {
  const response = await apiRequest(buildOpportunitiesPath(params));
  const payload: unknown = await response.json();

  const data = (payload as { data?: unknown })?.data;
  if (!Array.isArray(data)) {
    throw new ApiError(0, "The backend returned an unexpected response shape.");
  }

  return data.filter(isOpportunityLike);
}

/**
 * Fetch a single opportunity by MongoDB ObjectId *or* by slug (the backend
 * accepts both, which keeps legacy slug URLs and bookmarks working).
 * Returns null when the opportunity does not exist (404).
 */
export async function fetchOpportunity(idOrSlug: string): Promise<Opportunity | null> {
  try {
    const response = await apiRequest(
      `/api/opportunities/${encodeURIComponent(idOrSlug)}`,
    );
    const payload: unknown = await response.json();
    const data = (payload as { data?: unknown })?.data;

    return isOpportunityLike(data) ? data : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Pick up to `limit` related opportunities for a detail page: same category
 * first (in API order), padded with other categories when needed.
 */
export function selectRelatedOpportunities(
  all: Opportunity[],
  current: Opportunity,
  limit = 2,
): Opportunity[] {
  const isCurrent = (opportunity: Opportunity) =>
    opportunity.id === current.id || opportunity.slug === current.slug;

  const sameCategory = all.filter(
    (opportunity) => opportunity.category === current.category && !isCurrent(opportunity),
  );
  const otherCategories = all.filter(
    (opportunity) => opportunity.category !== current.category && !isCurrent(opportunity),
  );

  return [...sameCategory, ...otherCategories].slice(0, limit);
}

/**
 * Create a new event via POST /api/opportunities with a BetterAuth-issued
 * Bearer JWT. The backend binds the creator to the *verified* JWT identity,
 * so no creator field can be sent or trusted from the browser.
 * Returns the created opportunity (201) or throws ApiError.
 */
export async function createOpportunity(
  payload: Record<string, unknown>,
  authToken: string,
): Promise<Opportunity> {
  if (authToken.trim() === "") {
    throw new ApiError(0, "You need to be logged in to create an event.");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/opportunities`, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(0, "Cannot reach the CommonGround backend right now.");
  }

  if (!response.ok) {
    let message: string;
    try {
      const body = (await response.json()) as { message?: unknown; details?: { issues?: Array<{ message?: unknown }> } };
      const issue =
        (Array.isArray(body?.details?.issues) ? body.details.issues.map((i) => String(i.message))[0] : undefined) ||
        (typeof body?.message === "string" ? body.message : undefined);
      message = issue ||
        `The backend responded with HTTP ${response.status} while creating the event.`;
    } catch {
      message = `The backend responded with HTTP ${response.status} while creating the event.`;
    }
    throw new ApiError(response.status, message);
  }

  const result: unknown = await response.json();
  const data = (result as { data?: unknown })?.data;
  if (!isOpportunityLike(data)) {
    throw new ApiError(0, "The backend returned an unexpected response shape.");
  }
  return data;
}
