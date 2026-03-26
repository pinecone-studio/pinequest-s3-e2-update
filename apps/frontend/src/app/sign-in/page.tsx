import { Suspense } from "react";
import { AuthCard } from "@/app/components/auth/auth-card";
import { SignInForm } from "@/app/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthCard>
      <Suspense
        fallback={
          <div
            className="h-64 animate-pulse rounded-xl bg-gray-100"
            aria-hidden
          />
        }
      >
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
