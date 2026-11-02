"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { validatePasswordPolicy, validatePhotoUrl } from "@/lib/password-policy";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SignUpFieldErrors {
  name?: string;
  email?: string;
  photoURL?: string;
  password?: string;
}

/**
 * Registration with name, email, photo URL (optional) and password.
 * Mirrors the server-side password policy for instant feedback; the server
 * (src/lib/auth.ts) re-checks the same policy so it can never be bypassed.
 */
export function SignUpForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({});
  const [emailPending, setEmailPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  function validateFields(): SignUpFieldErrors {
    const errors: SignUpFieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    } else if (trimmedName.length > 80) {
      errors.name = "Your name must be 80 characters or fewer.";
    }

    if (!trimmedEmail) {
      errors.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    const photoError = validatePhotoUrl(photoURL);
    if (photoError) errors.photoURL = photoError;

    if (password.length > 128) {
      errors.password = "Password must be 128 characters or fewer.";
    } else {
      const passwordError = validatePasswordPolicy(password);
      if (passwordError) errors.password = passwordError;
    }

    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (emailPending || googlePending) return;

    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.add({
        type: "warning",
        title: "Please fix the highlighted fields",
        description: Object.values(errors)[0],
      });
      return;
    }

    setEmailPending(true);
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoURL.trim() || undefined,
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not create your account",
          description: error.message || "Please review your details and try again.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Welcome to CommonGround!",
        description: "Your account is ready — happy volunteering.",
      });
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.add({
        type: "error",
        title: "Network error",
        description: "Could not reach the authentication service. Please try again.",
      });
    } finally {
      setEmailPending(false);
    }
  }

  async function handleGoogle() {
    if (emailPending || googlePending) return;
    setGooglePending(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Google sign-in unavailable",
          description:
            error.message ||
            "Google sign-in is not configured yet on this deployment. Ask the site owner to set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET.",
        });
      }
    } catch {
      toast.add({
        type: "error",
        title: "Network error",
        description: "Could not reach the authentication service. Please try again.",
      });
    } finally {
      setGooglePending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        aria-label="Create a CommonGround account"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-name">Full name</Label>
          <Input
            id="signup-name"
            autoComplete="name"
            placeholder="e.g. Samira Rahman"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby="signup-name-error"
            maxLength={80}
            required
          />
          {fieldErrors.name ? (
            <p id="signup-name-error" className="text-xs text-destructive" role="alert">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-photo">Photo URL <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="signup-photo"
            type="url"
            inputMode="url"
            placeholder="https://example.com/me.jpg"
            value={photoURL}
            onChange={(event) => setPhotoURL(event.target.value)}
            aria-invalid={Boolean(fieldErrors.photoURL)}
            aria-describedby="signup-photo-error"
          />
          {fieldErrors.photoURL ? (
            <p id="signup-photo-error" className="text-xs text-destructive" role="alert">{fieldErrors.photoURL}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby="signup-email-error"
            maxLength={254}
            required
          />
          {fieldErrors.email ? (
            <p id="signup-email-error" className="text-xs text-destructive" role="alert">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby="signup-password-hint signup-password-error"
            maxLength={128}
            required
          />
          <p id="signup-password-hint" className="text-xs text-muted-foreground">
            At least 6 characters with one uppercase and one lowercase letter.
          </p>
          {fieldErrors.password ? (
            <p id="signup-password-error" className="text-xs text-destructive" role="alert">{fieldErrors.password}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={emailPending || googlePending}
          aria-disabled={emailPending || googlePending}
          className="h-11 bg-coral text-base text-coral-foreground hover:bg-coral/90"
        >
          {emailPending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground" role="separator" aria-label="Or">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        onClick={handleGoogle}
        variant="outline"
        disabled={emailPending || googlePending}
        aria-disabled={googlePending}
        className="h-11 text-base"
      >
        <GoogleIcon className="size-4" />
        {googlePending ? "Opening Google…" : "Continue with Google"}
      </Button>
    </div>
  );
}
