import { Suspense } from "react";
import { SignInForm } from "@/app/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen flex-col bg-[#f7f7f7]"
          aria-busy="true"
          aria-label="Уншиж байна"
        >
          <div className="mx-auto w-full max-w-md flex-1 px-5 py-6">
            <div className="h-96 animate-pulse rounded-2xl bg-gray-200/70" />
          </div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
