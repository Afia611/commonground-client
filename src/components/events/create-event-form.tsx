"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import {
  ApiError,
  createOpportunity,
} from "@/lib/opportunities-api";
import {
  EVENT_TYPES,
  buildCreateEventPayload,
  getMinSelectableDate,
  validateEventForm,
  type EventFormErrors,
  type EventFormValues,
  type EventType,
} from "@/lib/event-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

const EMPTY_FORM: EventFormValues = {
  title: "",
  description: "",
  eventType: "",
  imageUrl: "",
  location: "",
  eventDate: "",
};

/**
 * Create Event form. Requires a BetterAuth session: the page guarantees one
 * before rendering, and the JWT is fetched per submission from
 * authClient.token() — the backend binds the creator to that verified token.
 */
export function CreateEventForm() {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<EventFormErrors>({});
  const [submitPending, setSubmitPending] = useState(false);

  const minDate = useMemo(() => getMinSelectableDate(), []);

  function update<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitPending) return;

    const errors = validateEventForm(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.add({
        type: "warning",
        title: "Please fix the highlighted fields",
        description: Object.values(errors)[0],
      });
      return;
    }

    setSubmitPending(true);
    try {
      // The JWT identifies the creator on the backend — nothing identity
      // related is sent in the payload itself.
      const { data: tokenData } = await authClient.token();
      const jwt = tokenData?.token ?? "";
      if (!jwt) {
        toast.add({
          type: "error",
          title: "Session expired",
          description: "Please log in again, then try creating the event once more.",
        });
        return;
      }

      await createOpportunity(buildCreateEventPayload(values), jwt);

      toast.add({
        type: "success",
        title: "Event created!",
        description: "Your event is now live in the opportunities listing.",
      });
      router.push("/opportunities");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 0
          ? error.message
          : error instanceof ApiError
            ? error.message
            : "Something went wrong while creating the event.";
      toast.add({
        type: "error",
        title: "Could not create the event",
        description: message,
      });
    } finally {
      setSubmitPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="Create a new volunteering event" noValidate={false}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event-title">Event title</Label>
        <Input
          id="event-title"
          placeholder="e.g. Victory Day Park Cleanup"
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby="event-title-error"
          maxLength={120}
          required
        />
        {fieldErrors.title ? (
          <p id="event-title-error" className="text-xs text-destructive" role="alert">{fieldErrors.title}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          rows={5}
          placeholder="What will volunteers do? Who should join? What should they bring?"
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby="event-description-hint event-description-error"
          maxLength={4000}
          required
        />
        <p id="event-description-hint" className="text-xs text-muted-foreground">
          At least 20 characters.
        </p>
        {fieldErrors.description ? (
          <p id="event-description-error" className="text-xs text-destructive" role="alert">{fieldErrors.description}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="event-type">Event type</Label>
          <Select
  value={values.eventType || null}
  onValueChange={(value) => update("eventType", (value ?? "") as EventType)}
>
            <SelectTrigger
              id="event-type"
              className="w-full"
              aria-invalid={Boolean(fieldErrors.eventType)}
              aria-describedby="event-type-error"
            >
              <SelectValue placeholder="Choose a type" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.eventType ? (
            <p id="event-type-error" className="text-xs text-destructive" role="alert">{fieldErrors.eventType}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="event-date">Event date</Label>
          <Input
            id="event-date"
            type="date"
            min={minDate}
            value={values.eventDate}
            onChange={(event) => update("eventDate", event.target.value)}
            aria-invalid={Boolean(fieldErrors.eventDate)}
            aria-describedby="event-date-error"
            required
          />
          {fieldErrors.eventDate ? (
            <p id="event-date-error" className="text-xs text-destructive" role="alert">{fieldErrors.eventDate}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event-image">Thumbnail image URL <span className="text-muted-foreground">(optional)</span></Label>
        <Input
          id="event-image"
          type="url"
          inputMode="url"
          placeholder="https://example.com/event-banner.jpg"
          value={values.imageUrl}
          onChange={(event) => update("imageUrl", event.target.value)}
          aria-invalid={Boolean(fieldErrors.imageUrl)}
          aria-describedby="event-image-error"
        />
        {fieldErrors.imageUrl ? (
          <p id="event-image-error" className="text-xs text-destructive" role="alert">{fieldErrors.imageUrl}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event-location">Location</Label>
        <Input
          id="event-location"
          placeholder="e.g. Ramna Park, Dhaka, Bangladesh"
          value={values.location}
          onChange={(event) => update("location", event.target.value)}
          aria-invalid={Boolean(fieldErrors.location)}
          aria-describedby="event-location-error"
          maxLength={200}
          required
        />
        {fieldErrors.location ? (
          <p id="event-location-error" className="text-xs text-destructive" role="alert">{fieldErrors.location}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={submitPending}
        aria-disabled={submitPending}
        className="h-12 bg-coral text-base text-coral-foreground hover:bg-coral/90"
      >
        {submitPending ? (
          <>
            <Spinner className="size-4" />
            Creating event…
          </>
        ) : (
          "Create event"
        )}
      </Button>
    </form>
  );
}
