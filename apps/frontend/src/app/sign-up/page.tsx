import { Suspense } from "react";
import { SignUpForm } from "@/app/components/auth/sign-up-form";

export default function SignUpPage() {
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
      <SignUpForm />
    </Suspense>
  );
}
