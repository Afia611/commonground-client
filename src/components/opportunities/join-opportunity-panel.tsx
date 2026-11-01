
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type JoinedOpportunity = {
  id: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type RegistrationState = {
  userId: string;
  opportunityId: string;
  joined: boolean;
};

interface Props {
  opportunityId: string;
  initialSpotsLeft: number;
  spotsTotal: number;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000"
).replace(/\/+$/, "");

async function getToken(): Promise<string | null> {
  const result = await authClient.token();

  if (result.error || !result.data?.token) {
    return null;
  }

  return result.data.token;
}

async function apiRequest<T>(
  path: string,
  token: string,
  method = "GET",
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
        "Something went wrong. Please try again.",
    );
  }

  return result;
}

export function JoinOpportunityPanel({
  opportunityId,
  initialSpotsLeft,
  spotsTotal,
}: Props) {
  const router = useRouter();

  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  const userId = session?.user?.id ?? null;

  const [registration, setRegistration] =
    useState<RegistrationState | null>(null);

  const [checkedKey, setCheckedKey] = useState<string | null>(
    null,
  );

  const [spotsLeft, setSpotsLeft] = useState(initialSpotsLeft);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const registrationKey = userId
    ? `${userId}:${opportunityId}`
    : null;

  const joined =
    registration !== null &&
    registration.userId === userId &&
    registration.opportunityId === opportunityId &&
    registration.joined;

  const checking =
    sessionPending ||
    (userId !== null && checkedKey !== registrationKey);

  const refreshStatus = useCallback(
    async (activeUserId: string) => {
      const token = await getToken();

      if (!token) {
        throw new Error(
          "Unable to verify your session. Please sign in again.",
        );
      }

      const result = await apiRequest<JoinedOpportunity[]>(
        "/api/opportunities/joined",
        token,
      );

      const isJoined = (result.data ?? []).some(
        (item) => item.id === opportunityId,
      );

      return {
        userId: activeUserId,
        opportunityId,
        joined: isJoined,
      };
    },
    [opportunityId],
  );

  useEffect(() => {
    if (sessionPending || !userId || !registrationKey) {
      return;
    }

    let cancelled = false;

    async function loadRegistration() {
      try {
        const status = await refreshStatus(userId!);

        if (!cancelled) {
          setRegistration(status);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to check registration status.",
          );
        }
      } finally {
        if (!cancelled) {
          setCheckedKey(registrationKey);
        }
      }
    }

    void loadRegistration();

    return () => {
      cancelled = true;
    };
  }, [
    sessionPending,
    userId,
    registrationKey,
    refreshStatus,
  ]);

  async function handleParticipation() {
    setError("");
    setMessage("");

    if (!userId) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(
          `/opportunities/${opportunityId}`,
        )}`,
      );
      return;
    }

    const token = await getToken();

    if (!token) {
      setError(
        "Unable to verify your session. Please sign in again.",
      );
      return;
    }

    setSubmitting(true);

    const path = `/api/opportunities/${encodeURIComponent(
      opportunityId,
    )}/join`;

    try {
      if (joined) {
        await apiRequest<unknown>(path, token, "DELETE");

        setRegistration({
          userId,
          opportunityId,
          joined: false,
        });

        setSpotsLeft((current) =>
          Math.min(spotsTotal, current + 1),
        );

        setMessage(
          "You have left this opportunity.",
        );
      } else {
        await apiRequest<unknown>(path, token, "POST");

        setRegistration({
          userId,
          opportunityId,
          joined: true,
        });

        setSpotsLeft((current) =>
          Math.max(0, current - 1),
        );

        setMessage(
          "You have successfully joined this opportunity!",
        );
      }

      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to update registration.";

      try {
        const status = await refreshStatus(userId);
        setRegistration(status);
      } catch {
        // Preserve the original registration error.
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  const filled = Math.max(0, spotsTotal - spotsLeft);

  const percentage =
    spotsTotal > 0
      ? Math.min(
          100,
          Math.round((filled / spotsTotal) * 100),
        )
      : 0;

  const busy = checking || submitting;

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
      <div>
        <p className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">
            Places still open
          </span>

          <span className="font-semibold">
            {spotsLeft}/{spotsTotal}
          </span>
        </p>

        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Places filled"
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {filled} of {spotsTotal} places already taken
        </p>
      </div>

      <Button
        type="button"
        onClick={() => void handleParticipation()}
        disabled={
          busy ||
          Boolean(error && checking) ||
          (!joined && spotsLeft <= 0)
        }
        variant={joined ? "outline" : "default"}
        className={
          joined
            ? "h-12 text-base"
            : "h-12 bg-coral text-base text-coral-foreground hover:bg-coral/90"
        }
      >
        {busy
          ? "Please wait..."
          : joined
            ? "Leave Event"
            : spotsLeft <= 0
              ? "Event Full"
              : "Join this opportunity"}
      </Button>

      {joined && (
        <p className="text-sm font-medium text-primary">
          You are registered for this opportunity.
        </p>
      )}

      {message && (
        <p
          role="status"
          className="text-sm text-primary"
        >
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {!userId && !sessionPending && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          You will be asked to sign in before joining.
        </p>
      )}

      <Button
        render={<Link href="/dashboard/joined" />}
        nativeButton={false}
        variant="outline"
        className="h-12 text-base"
      >
        My Joined Events
      </Button>

      <Button
        render={<Link href="/opportunities" />}
        nativeButton={false}
        variant="outline"
        className="h-12 text-base"
      >
        Back to all opportunities
      </Button>
    </div>
  );
}
