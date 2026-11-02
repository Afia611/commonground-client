"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImageIcon, UserRound } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { validatePhotoUrl } from "@/lib/password-policy";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

const NAME_MIN = 2;
const NAME_MAX = 80;

type ProfileFieldErrors = {
  name?: string;
  image?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileForm({
  initialName,
  initialImage,
  email,
}: {
  initialName: string;
  initialImage: string;
  email: string;
}) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  const previewInitials = useMemo(() => initials(name), [name]);

  function validate(): ProfileFieldErrors {
    const errors: ProfileFieldErrors = {};
    const trimmedName = name.trim();

    if (trimmedName.length < NAME_MIN) {
      errors.name = `Your name must be at least ${NAME_MIN} characters.`;
    } else if (trimmedName.length > NAME_MAX) {
      errors.name = `Your name must be ${NAME_MAX} characters or fewer.`;
    }

    const imageError = validatePhotoUrl(imageUrl);
    if (imageError) errors.image = imageError;

    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const errors = validate();
    setFieldErrors(errors);
    setSaved(false);

    if (Object.keys(errors).length > 0) {
      toast.add({
        type: "warning",
        title: "Please check your profile details",
        description: Object.values(errors)[0],
      });
      return;
    }

    setPending(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl.trim() || null,
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not save your profile",
          description:
            error.message || "Please try again in a moment.",
        });
        return;
      }

      setSaved(true);
      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your name and photo are now up to date.",
      });

      // Refresh server components so the header and dashboard pick up the
      // new name/avatar immediately. The BetterAuth session atom also
      // refreshes itself after /update-user.
      router.refresh();
    } catch {
      toast.add({
        type: "error",
        title: "Network error",
        description:
          "Could not reach the authentication service. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 text-center shadow-sm">
        <Avatar className="size-24">
          {imageUrl.trim() ? (
            <AvatarImage
              src={imageUrl.trim()}
              alt={`${name || "Your"} profile photo preview`}
            />
          ) : null}
          <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
            {previewInitials}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="font-heading text-xl font-semibold">
            {name.trim() || "Your profile"}
          </p>
          <p className="mt-1 text-sm break-all text-muted-foreground">
            {email}
          </p>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Your name and profile picture appear on events you organise and in
          your account menu.
        </p>
      </aside>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
        aria-label="Update your CommonGround profile"
      >
        <div className="flex items-center gap-2">
          <UserRound aria-hidden="true" className="size-5 text-primary" />
          <h2 className="font-heading text-xl font-semibold">
            Personal details
          </h2>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Keep your details current so organisers know who is joining their
          events.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby="profile-name-error"
              maxLength={NAME_MAX}
              required
            />
            {fieldErrors.name ? (
              <p
                id="profile-name-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              readOnly
              disabled
              aria-describedby="profile-email-hint"
            />
            <p
              id="profile-email-hint"
              className="text-xs text-muted-foreground"
            >
              Your sign-in email cannot be changed here.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-image">
              Profile picture URL{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="profile-image"
              type="url"
              inputMode="url"
              placeholder="https://example.com/me.jpg"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              aria-invalid={Boolean(fieldErrors.image)}
              aria-describedby="profile-image-hint profile-image-error"
            />
            <p
              id="profile-image-hint"
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <ImageIcon aria-hidden="true" className="size-3.5" />
              Paste a public HTTPS image link. Leave it blank to use your
              initials.
            </p>
            {fieldErrors.image ? (
              <p
                id="profile-image-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {fieldErrors.image}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              disabled={pending}
              aria-disabled={pending}
              className="h-11 bg-coral px-6 text-coral-foreground hover:bg-coral/90"
            >
              {pending ? (
                <>
                  <Spinner className="size-4" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>

            {saved && !pending ? (
              <p
                role="status"
                className="flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                <Check aria-hidden="true" className="size-4" />
                Profile saved
              </p>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
