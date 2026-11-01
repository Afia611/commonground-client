
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, RefreshCw } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  fetchMyOpportunities,
  updateMyOpportunity,
  deleteMyOpportunity,
  getApiErrorMessage,
} from "@/lib/opportunities-api";
import {
  EVENT_TYPES,
  buildCreateEventPayload,
  validateEventForm,
  getMinSelectableDate,
  type EventFormValues,
  type EventType,
} from "@/lib/event-form";
import type { Opportunity } from "@/data/opportunities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

type ManagedEvent = Opportunity & {
  eventType?: string;
  eventDate?: string;
  imageUrl?: string;
  location?: string;
  description?: string;
};

function toDateInput(value: string | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function toFormValues(event: ManagedEvent): EventFormValues {
  const rawType = event.eventType ?? event.category ?? "";

  return {
    title: event.title,
    description: event.description ?? "",
    eventType: EVENT_TYPES.includes(rawType as EventType)
      ? (rawType as EventType)
      : "",
    imageUrl: event.imageUrl ?? "",
    location: event.location ?? "",
    eventDate: toDateInput(event.eventDate),
  };
}

async function getToken(): Promise<string> {
  const { data } = await authClient.token();

  if (!data?.token) {
    throw new Error(
      "Your session has expired. Please log in again.",
    );
  }

  return data.token;
}

export function ManageEvents() {
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ManagedEvent | null>(null);
  const [form, setForm] = useState<EventFormValues | null>(null);

  const loadEvents = useCallback(async () => {
  try {
    const token = await getToken();
    const result = await fetchMyOpportunities(token);

    setEvents(result);
    setError("");
  } catch (err) {
    setError(getApiErrorMessage(err));
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void loadEvents();
}, [loadEvents]);

  function startEdit(event: ManagedEvent) {
    setEditing(event);
    setForm(toFormValues(event));
  }

  function updateField<K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K],
  ) {
    setForm((previous) =>
      previous
        ? { ...previous, [key]: value }
        : previous,
    );
  }

  async function handleSave(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!editing || !form || busyId) return;

    const errors = validateEventForm(form);

    if (Object.keys(errors).length > 0) {
      toast.add({
        type: "warning",
        title: "Please check your event details",
        description: Object.values(errors)[0],
      });
      return;
    }

    setBusyId(editing.id);

    try {
      const token = await getToken();

      await updateMyOpportunity(
        editing.id,
        buildCreateEventPayload(form),
        token,
      );

      toast.add({
        type: "success",
        title: "Event updated",
        description: "Your changes have been saved.",
      });

      setEditing(null);
      setForm(null);

      await loadEvents();
    } catch (err) {
      toast.add({
        type: "error",
        title: "Could not update event",
        description: getApiErrorMessage(err),
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(event: ManagedEvent) {
    if (busyId) return;

    const confirmed = window.confirm(
      `Delete "${event.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(event.id);

    try {
      const token = await getToken();

      await deleteMyOpportunity(event.id, token);

      setEvents((current) =>
        current.filter((item) => item.id !== event.id),
      );

      if (editing?.id === event.id) {
        setEditing(null);
        setForm(null);
      }

      toast.add({
        type: "success",
        title: "Event deleted",
        description: "The event has been removed.",
      });
    } catch (err) {
      toast.add({
        type: "error",
        title: "Could not delete event",
        description: getApiErrorMessage(err),
      });
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Loading your events...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {events.length} event
          {events.length === 1 ? "" : "s"} created
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadEvents()}
            disabled={busyId !== null}
          >
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>

          <Link
            href="/events/create"
            className="inline-flex h-9 items-center justify-center rounded-md bg-coral px-4 text-sm font-medium text-coral-foreground hover:bg-coral/90"
          >
            <Plus className="mr-2 size-4" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive p-5"
        >
          <p className="text-sm text-destructive">
            {error}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => void loadEvents()}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!error && events.length === 0 && (
        <div className="rounded-xl border bg-card px-6 py-16 text-center">
          <h2 className="text-xl font-semibold">
            No events yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first volunteering event to bring
            people together.
          </p>

          <Link
            href="/events/create"
            className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create your first event
          </Link>
        </div>
      )}

      {/* Events list */}
      {!error && (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.id}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold">
                {event.title}
              </h2>

              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {event.description}
              </p>

              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <p>
                  Type: {event.eventType ?? event.category}
                </p>

                <p>
                  Location: {event.location ?? "Not specified"}
                </p>

                <p>
                  Date:{" "}
                  {toDateInput(event.eventDate) ||
                    "Not specified"}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={busyId !== null}
                  onClick={() => startEdit(event)}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  disabled={busyId !== null}
                  onClick={() => void handleDelete(event)}
                >
                  <Trash2 className="mr-2 size-4" />
                  {busyId === event.id
                    ? "Working..."
                    : "Delete"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Edit event form */}
      {editing && form && (
        <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
          <h2 className="mb-5 text-xl font-semibold">
            Edit: {editing.title}
          </h2>

          <form
            onSubmit={handleSave}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">
                Title
              </Label>

              <Input
                id="edit-title"
                value={form.title}
                onChange={(e) =>
                  updateField("title", e.target.value)
                }
                maxLength={120}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-description">
                Description
              </Label>

              <Textarea
                id="edit-description"
                rows={5}
                value={form.description}
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value,
                  )
                }
                maxLength={4000}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-type">
                  Event type
                </Label>

                <select
                  id="edit-type"
                  value={form.eventType}
                  onChange={(e) =>
                    updateField(
                      "eventType",
                      e.target.value as EventType,
                    )
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  required
                >
                  <option value="">
                    Choose a type
                  </option>

                  {EVENT_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-date">
                  Event date
                </Label>

                <Input
                  id="edit-date"
                  type="date"
                  min={getMinSelectableDate()}
                  value={form.eventDate}
                  onChange={(e) =>
                    updateField(
                      "eventDate",
                      e.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-location">
                Location
              </Label>

              <Input
                id="edit-location"
                value={form.location}
                onChange={(e) =>
                  updateField(
                    "location",
                    e.target.value,
                  )
                }
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-image">
                Image URL (optional)
              </Label>

              <Input
                id="edit-image"
                type="url"
                value={form.imageUrl}
                onChange={(e) =>
                  updateField(
                    "imageUrl",
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={busyId !== null}
              >
                {busyId
                  ? "Saving..."
                  : "Save changes"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={busyId !== null}
                onClick={() => {
                  setEditing(null);
                  setForm(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
