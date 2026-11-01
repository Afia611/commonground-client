
/**
 * Reusable API client for the CommonGround Express backend.
 *
 * Public:
 * - GET    /api/opportunities
 * - GET    /api/opportunities/:id
 *
 * Authenticated:
 * - POST   /api/opportunities
 * - GET    /api/opportunities/mine
 * - PATCH  /api/opportunities/:id
 * - DELETE /api/opportunities/:id
 *
 * Authenticated requests use BetterAuth-issued JWTs.
 */

import type { Opportunity } from "@/data/opportunities";

const DEFAULT_API_URL = "http://localhost:5000";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL
).replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 10_000;

export const MAX_PAGE_SIZE = 50;

// --------------------------------------------------
// API ERROR HANDLING
// --------------------------------------------------

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading opportunities.";
}

// --------------------------------------------------
// RESPONSE VALIDATION
// --------------------------------------------------

function isOpportunityLike(value: unknown): value is Opportunity {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { id?: unknown }).id === "string" &&
    typeof (value as { title?: unknown }).title === "string" &&
    ((value as { title: string }).title).trim() !== ""
  );
}

// --------------------------------------------------
// SHARED PUBLIC REQUEST HELPER
// --------------------------------------------------

async function apiRequest(path: string): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new ApiError(
      0,
      "Cannot reach the CommonGround backend right now.",
    );
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `The backend responded with HTTP ${response.status} for ${path}.`,
    );
  }

  return response;
}

// --------------------------------------------------
// FETCH PUBLIC OPPORTUNITIES
// --------------------------------------------------

export interface FetchOpportunitiesParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export function buildOpportunitiesPath(
  params: FetchOpportunitiesParams = {},
): string {
  const search = new URLSearchParams();

  if (params.page !== undefined) {
    search.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    search.set("limit", String(params.limit));
  }

  if (params.category) {
    search.set("category", params.category);
  }

  if (params.search) {
    search.set("search", params.search);
  }

  const query = search.toString();

  return `/api/opportunities${query ? `?${query}` : ""}`;
}

export async function fetchOpportunities(
  params: FetchOpportunitiesParams = {},
): Promise<Opportunity[]> {
  const response = await apiRequest(
    buildOpportunitiesPath(params),
  );

  const payload: unknown = await response.json();

  const data = (payload as { data?: unknown })?.data;

  if (!Array.isArray(data)) {
    throw new ApiError(
      0,
      "The backend returned an unexpected response shape.",
    );
  }

  return data.filter(isOpportunityLike);
}

// --------------------------------------------------
// FETCH SINGLE OPPORTUNITY
// --------------------------------------------------

export async function fetchOpportunity(
  idOrSlug: string,
): Promise<Opportunity | null> {
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

// --------------------------------------------------
// RELATED OPPORTUNITIES
// --------------------------------------------------

export function selectRelatedOpportunities(
  all: Opportunity[],
  current: Opportunity,
  limit = 2,
): Opportunity[] {
  const isCurrent = (opportunity: Opportunity) =>
    opportunity.id === current.id ||
    opportunity.slug === current.slug;

  const sameCategory = all.filter(
    (opportunity) =>
      opportunity.category === current.category &&
      !isCurrent(opportunity),
  );

  const otherCategories = all.filter(
    (opportunity) =>
      opportunity.category !== current.category &&
      !isCurrent(opportunity),
  );

  return [...sameCategory, ...otherCategories].slice(0, limit);
}

// --------------------------------------------------
// CREATE OPPORTUNITY
// --------------------------------------------------

export async function createOpportunity(
  payload: Record<string, unknown>,
  authToken: string,
): Promise<Opportunity> {
  if (!authToken.trim()) {
    throw new ApiError(
      401,
      "You need to be logged in to create an event.",
    );
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
    throw new ApiError(
      0,
      "Cannot reach the CommonGround backend right now.",
    );
  }

  if (!response.ok) {
    let message =
      `The backend responded with HTTP ${response.status} while creating the event.`;

    try {
      const body = (await response.json()) as {
        message?: unknown;
        details?: {
          issues?: Array<{ message?: unknown }>;
        };
      };

      const issue = Array.isArray(body?.details?.issues)
        ? body.details.issues
            .map((item) => String(item.message))
            .find(Boolean)
        : undefined;

      message =
        issue ||
        (typeof body.message === "string"
          ? body.message
          : message);
    } catch {
      // Keep the original HTTP error message.
    }

    throw new ApiError(response.status, message);
  }

  const result: unknown = await response.json();

  const data = (result as { data?: unknown })?.data;

  if (!isOpportunityLike(data)) {
    throw new ApiError(
      0,
      "The backend returned an unexpected response shape.",
    );
  }

  return data;
}

// --------------------------------------------------
// SHARED AUTHENTICATED REQUEST HELPER
// --------------------------------------------------

async function managedEventRequest(
  path: string,
  token: string,
  method: "GET" | "PATCH" | "DELETE",
  payload?: Record<string, unknown>,
): Promise<unknown> {
  if (!token.trim()) {
    throw new ApiError(
      401,
      "Your session has expired. Please log in again.",
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(payload
          ? { "Content-Type": "application/json" }
          : {}),
      },
      ...(payload
        ? { body: JSON.stringify(payload) }
        : {}),
    });
  } catch {
    throw new ApiError(
      0,
      "Cannot reach the CommonGround backend right now.",
    );
  }

  if (!response.ok) {
    let message = `Request failed (HTTP ${response.status}).`;

    try {
      const body = (await response.json()) as {
        message?: unknown;
        details?: {
          issues?: Array<{ message?: unknown }>;
        };
      };

      const issue = body.details?.issues?.[0]?.message;

message =
  (typeof issue === "string" ? issue : undefined) ??
  (typeof body.message === "string" ? body.message : undefined) ??
  message;
    } catch {
      // Keep the HTTP error message.
    }

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

// --------------------------------------------------
// FETCH EVENTS CREATED BY CURRENT USER
// --------------------------------------------------

export async function fetchMyOpportunities(
  token: string,
): Promise<Opportunity[]> {
  const result = await managedEventRequest(
    "/api/opportunities/mine",
    token,
    "GET",
  );

  const data = (result as { data?: unknown } | null)?.data;

  if (!Array.isArray(data)) {
    throw new ApiError(
      0,
      "The backend returned an unexpected event list response.",
    );
  }

  return data.filter(isOpportunityLike);
}

// --------------------------------------------------
// UPDATE OWN EVENT
// --------------------------------------------------

export async function updateMyOpportunity(
  id: string,
  payload: Record<string, unknown>,
  token: string,
): Promise<void> {
  if (!id.trim()) {
    throw new ApiError(400, "Event ID is required.");
  }

  await managedEventRequest(
    `/api/opportunities/${encodeURIComponent(id)}`,
    token,
    "PATCH",
    payload,
  );
}

// --------------------------------------------------
// DELETE OWN EVENT
// --------------------------------------------------

export async function deleteMyOpportunity(
  id: string,
  token: string,
): Promise<void> {
  if (!id.trim()) {
    throw new ApiError(400, "Event ID is required.");
  }

  await managedEventRequest(
    `/api/opportunities/${encodeURIComponent(id)}`,
    token,
    "DELETE",
  );
}
