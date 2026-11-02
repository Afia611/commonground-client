
/**
 * Client-side validation for the Create Event form.
 * Mirrors the backend schema so users receive instant feedback.
 * The backend must also validate submitted data.
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

/**
 * Format a local calendar date as YYYY-MM-DD.
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Get tomorrow's date.
 * Today and all past dates are not allowed.
 */
export function getMinSelectableDate(): string {
  const tomorrow = new Date();

  // Noon avoids edge cases around daylight saving changes.
  tomorrow.setHours(12, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return formatLocalDate(tomorrow);
}

/**
 * Validate that an event date:
 * 1. Uses YYYY-MM-DD format.
 * 2. Is a real calendar date.
 * 3. Is strictly after today.
 */
export function isFutureDate(raw: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return false;
  }

  const selected = new Date(`${raw}T12:00:00`);

  if (Number.isNaN(selected.getTime())) {
    return false;
  }

  // Reject invalid dates such as 2026-02-30.
  if (formatLocalDate(selected) !== raw) {
    return false;
  }

  const today = formatLocalDate(new Date());

  return raw > today;
}

/**
 * Validate HTTP or HTTPS image URLs.
 */
function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

/**
 * Validate all Create Event fields.
 */
export function validateEventForm(
  values: EventFormValues,
): EventFormErrors {
  const errors: EventFormErrors = {};

  // Event title
  if (values.title.trim().length < TITLE_MIN) {
    errors.title = `Title must be at least ${TITLE_MIN} characters.`;
  }

  // Event description
  if (values.description.trim().length < DESCRIPTION_MIN) {
    errors.description =
      `Description must be at least ${DESCRIPTION_MIN} characters.`;
  }

  // Event type
  if (
    !values.eventType ||
    !(EVENT_TYPES as readonly string[]).includes(values.eventType)
  ) {
    errors.eventType = "Please choose a valid event type.";
  }

  // Thumbnail image URL (optional)
  const photo = values.imageUrl.trim();

  if (photo !== "" && !isValidHttpUrl(photo)) {
    errors.imageUrl =
      "Thumbnail must be a valid HTTP or HTTPS URL.";
  }

  // Event location
  if (values.location.trim().length < LOCATION_MIN) {
    errors.location =
      `Location must be at least ${LOCATION_MIN} characters.`;
  }

  // Event date
  const eventDate = values.eventDate.trim();

  if (eventDate === "") {
    errors.eventDate = "Please choose an event date.";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
    errors.eventDate =
      "Event date must be in YYYY-MM-DD format.";
  } else if (!isFutureDate(eventDate)) {
    errors.eventDate =
      "Event date must be in the future.";
  }

  return errors;
}

/**
 * Build the payload for POST /api/opportunities.
 * Creator identity is supplied separately through the JWT.
 */
export function buildCreateEventPayload(
  values: EventFormValues,
) {
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
    eventType: values.eventType as Exclude<
      EventFormValues["eventType"],
      ""
    >,
    location: values.location.trim(),
    eventDate: values.eventDate.trim(),
  };

  const photo = values.imageUrl.trim();

  if (photo !== "") {
    payload.imageUrl = photo;
  }

  return payload;
}
