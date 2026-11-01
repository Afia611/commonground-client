/**
 * Client-side validation for the Create Event form, mirroring the server
 * schema in the backend's src/schemas/opportunity.schema.ts so volunteers get
 * instant feedback. The server re-validates everything before persisting.
 */

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Community Care",
  "Other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface EventFormValues {
  title: string;
  description: string;
  eventType: EventType | "";
  imageUrl: string;
  location: string;
  eventDate: string;
}

export interface EventFormErrors {
  title?: string;
  description?: string;
  eventType?: string;
  imageUrl?: string;
  location?: string;
  eventDate?: string;
}

const TITLE_MIN = 3;
const DESCRIPTION_MIN = 20;
const LOCATION_MIN = 3;

/** Mirror of the backend's past-date rule: whole calendar days, server-local. */
export function isFutureOrTodayDate(raw: string): boolean {
  const dayStart = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(dayStart.getTime())) return false;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return dayStart.getTime() >= todayStart.getTime();
}

/** Only whole calendar days (today and later) are pickable in the date input. */
export function getMinSelectableDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Full field validation; returns the first message per field. */
export function validateEventForm(values: EventFormValues): EventFormErrors {
  const errors: EventFormErrors = {};

  if (values.title.trim().length < TITLE_MIN) {
    errors.title = `Title must be at least ${TITLE_MIN} characters.`;
  }
  if (values.description.trim().length < DESCRIPTION_MIN) {
    errors.description = `Description must be at least ${DESCRIPTION_MIN} characters.`;
  }
  if (!values.eventType) {
    errors.eventType = "Please choose an event type.";
  }
  const photo = values.imageUrl.trim();
  if (photo !== "" && !isValidHttpUrl(photo)) {
    errors.imageUrl = "Thumbnail must be a valid http(s) URL.";
  }
  if (values.location.trim().length < LOCATION_MIN) {
    errors.location = "Location must be at least 3 characters.";
  }
  if (values.eventDate.trim() === "") {
    errors.eventDate = "Please choose an event date.";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.eventDate.trim())) {
    errors.eventDate = "Event date must be in YYYY-MM-DD format.";
  } else if (!isFutureOrTodayDate(values.eventDate.trim())) {
    errors.eventDate = "Event date cannot be in the past.";
  }

  return errors;
}

/** Body sent to POST /api/opportunities, shaped like the backend schema. */
export function buildCreateEventPayload(values: EventFormValues) {
  const payload: {
    title: string;
    description: string;
    eventType: Exclude<EventFormValues["eventType"], "">;
    location: string;
    eventDate: string;
    imageUrl?: string;
  } = {
    title: values.title.trim(),
    description: values.description.trim(),
    eventType: values.eventType as Exclude<EventFormValues["eventType"], "">,
    location: values.location.trim(),
    eventDate: values.eventDate.trim(),
  };
  const photo = values.imageUrl.trim();
  if (photo !== "") payload.imageUrl = photo;
  return payload;
}
