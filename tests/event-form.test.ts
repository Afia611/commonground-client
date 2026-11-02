import { describe, expect, it } from "vitest";
import {
  buildCreateEventPayload,
  getMinSelectableDate,
  isFutureDate,
  validateEventForm,
} from "../src/lib/event-form";

function daysFromToday(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

describe("isFutureDate", () => {
  it("accepts future dates", () => {
    expect(isFutureDate(daysFromToday(1))).toBe(true);
    expect(isFutureDate(daysFromToday(30))).toBe(true);
  });

  it("rejects today and past dates", () => {
    expect(isFutureDate(daysFromToday(0))).toBe(false);
    expect(isFutureDate(daysFromToday(-1))).toBe(false);
    expect(isFutureDate(daysFromToday(-365))).toBe(false);
  });
});

describe("validateEventForm", () => {
  const valid = {
    title: "Community Street Cleanup",
    description: "We will pick up litter along the footpath and plant a few flowering shrubs.",
    eventType: "Cleanup" as const,
    imageUrl: "https://images.example.com/cleanup.jpg",
    location: "Rampura Bridge, Dhaka, Bangladesh",
    eventDate: daysFromToday(14),
  };

  it("accepts a fully valid form, optional thumbnail included", () => {
    expect(validateEventForm(valid)).toEqual({});
  });

  it("accepts an omitted thumbnail URL", () => {
    const errors = validateEventForm({ ...valid, imageUrl: "" });
    expect(errors).toEqual({});
  });

  it("collects every missing field", () => {
    const errors = validateEventForm({
      title: "ab",
      description: "too short",
      eventType: "",
      imageUrl: "",
      location: "x",
      eventDate: "",
    });

    expect(Object.keys(errors).sort()).toEqual([
      "description",
      "eventDate",
      "eventType",
      "location",
      "title",
    ]);
    expect(errors.description).toMatch(/20 characters/);
    expect(errors.eventType).toMatch(/event type/);
  });

  it("rejects a past event date", () => {
    const errors = validateEventForm({ ...valid, eventDate: daysFromToday(-2) });
    expect(errors.eventDate).toMatch(/must be in the future/);
  });

  it("rejects today's event date", () => {
    const errors = validateEventForm({ ...valid, eventDate: daysFromToday(0) });
    expect(errors.eventDate).toMatch(/must be in the future/);
  });

  it("rejects non-http thumbnail URLs", () => {
    const errors = validateEventForm({ ...valid, imageUrl: "javascript:alert(1)" });
    expect(errors.imageUrl).toMatch(/valid HTTP or HTTPS/);
  });
});

describe("buildCreateEventPayload", () => {
  it("trims and omits an empty thumbnail", () => {
    const payload = buildCreateEventPayload({
      title: "  River Cleanup  ",
      description: "Cleaning the Buriganga embankment stretch together.",
      eventType: "Cleanup",
      imageUrl: "   ",
      location: " Buriganga Bank, Dhaka ",
      eventDate: daysFromToday(10),
    });

    expect(payload).toEqual({
      title: "River Cleanup",
      description: "Cleaning the Buriganga embankment stretch together.",
      eventType: "Cleanup",
      location: "Buriganga Bank, Dhaka",
      eventDate: daysFromToday(10),
    });
    expect("imageUrl" in payload).toBe(false);
  });
});

describe("getMinSelectableDate", () => {
  it("is tomorrow in local time so only future dates are selectable", () => {
    expect(getMinSelectableDate()).toBe(daysFromToday(1));
  });
});
