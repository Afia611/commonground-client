"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

/**
 * Email + password login with optional Google social login.
 * Belongs to the BetterAuth session based on signed httpOnly cookies, so
 * no token or credential is ever exposed to the browser.
 */
export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [emailPending, setEmailPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  function validateFields(): LoginFieldErrors {
    const errors: LoginFieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Please enter your password.";
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
        title: "Please check your sign-in details",
        description: Object.values(errors)[0],
      });
      return;
    }

    setEmailPending(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not log you in",
          description: error.message || "Please check your email and password.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Welcome back!",
        description: "You are now signed in.",
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate aria-label="Log in to CommonGround">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby="login-email-error"
            maxLength={254}
            required
          />
          {fieldErrors.email ? (
            <p id="login-email-error" className="text-xs text-destructive" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby="login-password-error"
            maxLength={128}
            required
          />
          {fieldErrors.password ? (
            <p id="login-password-error" className="text-xs text-destructive" role="alert">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={emailPending || googlePending}
          aria-disabled={emailPending || googlePending}
          className="h-11 bg-coral text-base text-coral-foreground hover:bg-coral/90"
        >
          {emailPending ? "Logging in…" : "Log in"}
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
