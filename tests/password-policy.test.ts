import { describe, expect, it } from "vitest";
import {
  PASSWORD_MIN_LENGTH,
  sanitizeCallbackUrl,
  validatePasswordPolicy,
  validatePhotoUrl,
} from "../src/lib/password-policy";

describe("validatePasswordPolicy", () => {
  it("accepts passwords with 6+ characters, an uppercase and a lowercase letter", () => {
    expect(validatePasswordPolicy("Abc123")).toBeNull();
    expect(validatePasswordPolicy("FuchkaTime65")).toBeNull();
    expect(validatePasswordPolicy("LongPasswordOnly")).toBeNull();
  });

  it("rejects passwords shorter than six characters", () => {
    expect(validatePasswordPolicy("Ab1")).toMatch(/at least 6 characters/);
    expect(validatePasswordPolicy("Abcd5")).toMatch(/at least 6 characters/);
  });

  it("rejects passwords without an uppercase letter", () => {
    expect(validatePasswordPolicy("abcdef1")).toMatch(/uppercase/);
  });

  it("rejects passwords without a lowercase letter", () => {
    expect(validatePasswordPolicy("ABCDEF1")).toMatch(/lowercase/);
  });

  it("keeps the documented minimum in sync", () => {
    expect(PASSWORD_MIN_LENGTH).toBe(6);
  });
});

describe("sanitizeCallbackUrl", () => {
  it("returns same-origin relative paths unchanged", () => {
    expect(sanitizeCallbackUrl("/events/created")).toBe("/events/created");
    expect(sanitizeCallbackUrl("/opportunities/garden-restoration")).toBe(
      "/opportunities/garden-restoration",
    );
  });

  it("falls back for empty or missing values", () => {
    expect(sanitizeCallbackUrl(undefined)).toBe("/");
    expect(sanitizeCallbackUrl("")).toBe("/");
    expect(sanitizeCallbackUrl(null, "/opportunities")).toBe("/opportunities");
  });

  it("blocks open-redirect attempts", () => {
    expect(sanitizeCallbackUrl("https://evil.example.com")).toBe("/");
    expect(sanitizeCallbackUrl("//evil.example.com")).toBe("/");
    expect(sanitizeCallbackUrl("javascript:alert(1)")).toBe("/");
    expect(sanitizeCallbackUrl("/\\evil.example.com")).toBe("/");
  });
});

describe("validatePhotoUrl", () => {
  it("allows http(s) URLs", () => {
    expect(validatePhotoUrl("https://example.com/me.png")).toBeNull();
    expect(validatePhotoUrl("http://example.com/avatar.jpg")).toBeNull();
    expect(
      validatePhotoUrl("https://res.cloudinary.com/demo/image/upload/cat.png"),
    ).toBeNull();
  });

  it("treats an empty value as optional", () => {
    expect(validatePhotoUrl("")).toBeNull();
    expect(validatePhotoUrl("   ")).toBeNull();
  });

  it("rejects non-http protocols and invalid URLs", () => {
    expect(validatePhotoUrl("javascript:alert(1)")).toMatch(/valid http\(s\)/);
    expect(validatePhotoUrl("https://")).toMatch(/valid http\(s\)/);
    expect(validatePhotoUrl("not a url")).toMatch(/valid http\(s\)/);
  });
});
