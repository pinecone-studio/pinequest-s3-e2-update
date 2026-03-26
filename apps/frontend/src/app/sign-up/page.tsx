import { Suspense } from "react";
import { AuthCard } from "@/app/components/auth/auth-card";
import { SignUpForm } from "@/app/components/auth/sign-up-form";

export default function SignUpPage() {
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
        <SignUpForm />
      </Suspense>
    </AuthCard>
  );
}
