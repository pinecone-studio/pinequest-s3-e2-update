"use client";

import { useAuth, useClerk, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthButton } from "@/app/components/auth/auth-button";
import { AuthInput } from "@/app/components/auth/auth-input";
import { GoogleIcon } from "@/app/components/auth/google-icon";
import {
  LOGIN_INTENT_QUERY_KEY,
  absoluteAppUrlForPath,
  authSignUpHref,
  authSsoCallbackFullUrl,
  hardNavigateToAppPath,
  oauthPostAuthRedirectUrl,
  safeAuthRedirect,
} from "@/app/lib/auth-redirect";
import { clerkTryReloadSessionResource } from "@/app/lib/clerk-try-reload";

export function SignInForm() {
  const searchParams = useSearchParams();
  const afterAuthUrl = useMemo(
    () => safeAuthRedirect(searchParams.get(LOGIN_INTENT_QUERY_KEY)),
    [searchParams],
  );

  const { isLoaded, isSignedIn } = useAuth();
  const { setActive } = useClerk();
  const { signIn, errors } = useSignIn();
  /** Нууц үг + setActive урсгалд useEffect-ийн зөөлөн шилжилт давхар ажиллуулахгүй */
  const skipSignedInEffectRedirect = useRef(false);
  const [fetching, setFetching] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const loading = !isLoaded || fetching;
  const err = errors as
    | {
        emailAddress?: { message?: string };
        identifier?: { message?: string };
        password?: { message?: string };
      }
    | null
    | undefined;
  const emailError = err?.emailAddress?.message ?? err?.identifier?.message;
  const passwordError = err?.password?.message;

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (skipSignedInEffectRedirect.current) return;
    hardNavigateToAppPath(oauthPostAuthRedirectUrl(afterAuthUrl));
  }, [afterAuthUrl, isLoaded, isSignedIn]);

  const activateSessionAndRedirect = useCallback(async () => {
    if (!signIn || signIn.status !== "complete") return;
    let sessionId = signIn.createdSessionId;
    if (!sessionId) {
      await clerkTryReloadSessionResource(signIn);
      sessionId = signIn.createdSessionId;
    }
    if (!sessionId) {
      throw new Error("Session олдсонгүй. Дахин нэвтэрнэ үү.");
    }
    await setActive({ session: sessionId });
    hardNavigateToAppPath(oauthPostAuthRedirectUrl(afterAuthUrl));
  }, [afterAuthUrl, setActive, signIn]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (!signIn) {
      setFormError("Authentication is not ready. Please refresh.");
      return;
    }

    setFetching(true);
    /** Clerk нууц үг амжилттай болгоход `isSignedIn` эхлүүлэгдэнэ. useEffect түрүүлж шилжвэл cookie бэлэн биш → дахин ачаалалтын гогцоо. */
    skipSignedInEffectRedirect.current = true;
    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        skipSignedInEffectRedirect.current = false;
        if (/already signed in/i.test(error.message ?? "")) {
          hardNavigateToAppPath(oauthPostAuthRedirectUrl(afterAuthUrl));
          return;
        }
        setFormError(error.message ?? "Sign in failed.");
        return;
      }

      if (signIn.status === "complete") {
        try {
          await activateSessionAndRedirect();
        } catch (caught: unknown) {
          skipSignedInEffectRedirect.current = false;
          const msg =
            caught instanceof Error ? caught.message : "Нэвтрэхэд алдаа гарлаа.";
          setFormError(msg);
        }
      } else if (signIn.status === "needs_second_factor") {
        skipSignedInEffectRedirect.current = false;
        setFormError("Additional verification required. Use the prebuilt flow or enable a simpler MFA setup.");
      } else if (signIn.status === "needs_client_trust") {
        skipSignedInEffectRedirect.current = false;
        setFormError("This device needs extra verification. Check your email for a code.");
      } else {
        skipSignedInEffectRedirect.current = false;
        setFormError("Нэвтрэлт дуусаагүй байна. И-мэйлээ баталгаажуулсан эсэхээ шалгана уу.");
      }
    } finally {
      setFetching(false);
    }
  }

  async function onGoogle() {
    setFormError(null);
    if (!signIn) return;
    setFetching(true);
    try {
      const redirectUrl = absoluteAppUrlForPath(
        window.location.origin,
        oauthPostAuthRedirectUrl(afterAuthUrl),
      );
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectUrl,
        redirectCallbackUrl: authSsoCallbackFullUrl(window.location.origin),
      });
      if (error) {
        setFormError(error.message ?? "Google sign-in failed.");
      }
    } finally {
      setFetching(false);
    }
  }

  const signUpHref = authSignUpHref(afterAuthUrl);

  if (!isLoaded) {
    return (
      <div className="h-48 animate-pulse rounded-xl bg-gray-100" aria-hidden />
    );
  }

  if (isSignedIn) {
    return (
      <div className="py-8 text-center text-sm text-gray-600">
        Та аль хэдийн нэвтэрсэн байна. Шилжиж байна…
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
        Sign in
      </h1>
      <p className="mt-1 text-sm text-gray-500">Welcome back</p>

      <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
        <AuthInput
          id="signin-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          required
          disabled={loading}
        />
        <AuthInput
          id="signin-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          required
          disabled={loading}
        />

        {formError ? (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}

        <AuthButton type="submit" disabled={loading}>
          {fetching ? "Signing in…" : "Sign in"}
        </AuthButton>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wide">
          <span className="bg-white px-3 text-gray-400">or</span>
        </div>
      </div>

      <AuthButton
        type="button"
        variant="social"
        disabled={loading}
        onClick={onGoogle}
      >
        <GoogleIcon />
        Continue with Google
      </AuthButton>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href={signUpHref}
          className="font-semibold text-gray-900 underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
