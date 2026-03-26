"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { AUTH_ROUTES } from "@/app/lib/auth-redirect";

/**
 * Completes OAuth (e.g. Google) after redirect.
 * Final destination uses `redirectUrl` passed to `signIn.sso()` from the sign-in page.
 */
export default function SsoCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
      <AuthenticateWithRedirectCallback
        signInUrl={AUTH_ROUTES.signIn}
        signUpUrl={AUTH_ROUTES.signUp}
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
      <div id="clerk-captcha" />
    </div>
  );
}
