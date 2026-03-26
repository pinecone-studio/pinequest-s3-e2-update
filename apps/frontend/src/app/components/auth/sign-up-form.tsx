"use client";

import { useAuth, useClerk, useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AuthButton } from "@/app/components/auth/auth-button";
import { AuthInput } from "@/app/components/auth/auth-input";
import { GoogleIcon } from "@/app/components/auth/google-icon";
import { OrganizationDivisionSelects } from "@/app/components/auth/organization-division-selects";
import { saveSignUpProfileExtras } from "@/app/actions/sign-up-profile";
import {
  LOGIN_INTENT_QUERY_KEY,
  absoluteAppUrlForPath,
  authSignInHref,
  authSsoCallbackFullUrl,
  hardNavigateToAppPath,
  oauthPostAuthRedirectUrl,
  safeAuthRedirect,
} from "@/app/lib/auth-redirect";
import { clerkTryReloadSessionResource } from "@/app/lib/clerk-try-reload";
import {
  hasAnyOrganizationSignupField,
  mergeOrganizationFieldsIntoUnsafeMetadata,
} from "@/app/lib/sign-up-org-metadata";

type Step = "credentials" | "verify";

/**
 * Овог/нэр маягтаас авахгүй — Clerk-д имэйлийн хаягаас placeholder нэр өгнө.
 */
function clerkDisplayNameFromEmail(emailAddr: string): {
  firstName: string;
  lastName: string;
} {
  const raw = emailAddr.split("@")[0]?.trim() || "user";
  const safe =
    raw
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 40) || "user";
  // Clerk name validators often reject placeholder punctuation (e.g. "-").
  return { firstName: safe, lastName: safe };
}

export function SignUpForm() {
  const searchParams = useSearchParams();
  const afterAuthUrl = useMemo(
    () => safeAuthRedirect(searchParams.get(LOGIN_INTENT_QUERY_KEY)),
    [searchParams],
  );
  /** Захиргаа / байгууллагын эхний бүртгэл — хаяг, бүртгэлийн дугаар заавал. */
  const isOrganizationSignup = afterAuthUrl === "/admin";

  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();
  const { signUp, errors } = useSignUp();
  const [step, setStep] = useState<Step>("credentials");
  const [fetching, setFetching] = useState(false);
  const [organizationAimag, setOrganizationAimag] = useState("");
  const [organizationHot, setOrganizationHot] = useState("");
  const [organizationSum, setOrganizationSum] = useState("");
  const [organizationAddressDetail, setOrganizationAddressDetail] =
    useState("");
  const [organizationRegister, setOrganizationRegister] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    organizationRegion?: string;
    organizationSum?: string;
    organizationRegister?: string;
  }>({});

  const loading = !isLoaded || fetching;
  const err = errors as
    | {
        emailAddress?: { message?: string };
        password?: { message?: string };
        code?: { message?: string };
      }
    | null
    | undefined;
  const emailError = err?.emailAddress?.message;
  const passwordError = err?.password?.message;
  const codeError = err?.code?.message;

  const dashboardUrl = useMemo(
    () => oauthPostAuthRedirectUrl(afterAuthUrl),
    [afterAuthUrl],
  );

  /** Баталгаажуулалтын дараа `isSignedIn` түрүүлж идэвхжихэд доорх effect түрүүлж шилжвэл setActive-д үлдэнэ */
  const skipSignedInEffectRedirect = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    // verify алхамд setActive + бүтэн шилжилт зохион байгуулна.
    if (step === "verify") return;
    if (skipSignedInEffectRedirect.current) return;
    hardNavigateToAppPath(dashboardUrl);
  }, [dashboardUrl, isLoaded, isSignedIn, step]);

  /** Clerk v7: `finalize`-ийн оронд `setActive(createdSessionId)` — session cookie зөв тавигдана. */
  const activateSessionAndSaveExtras = useCallback(
    async (
      orgAimag: string,
      orgHot: string,
      orgSum: string,
      orgDetail: string,
      orgReg: string,
    ) => {
      if (!signUp || signUp.status !== "complete") return;
      let sessionId = signUp.createdSessionId;
      if (!sessionId) {
        await clerkTryReloadSessionResource(signUp);
        sessionId = signUp.createdSessionId;
      }
      if (!sessionId) {
        throw new Error("Session үүсээгүй байна. Дахин оролдоно уу.");
      }
      const a = orgAimag.trim();
      const h = orgHot.trim();
      const s = orgSum.trim();
      const d = orgDetail.trim();
      const r = orgReg.trim();

      await clerk.setActive({ session: sessionId });

      if (hasAnyOrganizationSignupField(a, h, s, d, r)) {
        const sleep = (ms: number) =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
          });
        let saved = false;
        for (let i = 0; i < 30 && !saved; i++) {
          const u = clerk.user;
          if (u) {
            await u.update({
              unsafeMetadata: mergeOrganizationFieldsIntoUnsafeMetadata(
                u.unsafeMetadata as Record<string, unknown>,
                a,
                h,
                s,
                d,
                r,
              ),
            });
            saved = true;
            break;
          }
          await sleep(50);
        }
        if (!saved) {
          try {
            await saveSignUpProfileExtras(a, h, s, d, r);
          } catch {
            // Сервер талд session харагдахгүй үлдвэл алгасна
          }
        }
      }

      hardNavigateToAppPath(oauthPostAuthRedirectUrl(afterAuthUrl));
    },
    [afterAuthUrl, clerk, signUp],
  );

  async function onCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setConfirmError(null);
    setFieldErrors({});

    if (!signUp) {
      setFormError("Authentication is not ready. Please refresh.");
      return;
    }

    const nextErrors: typeof fieldErrors = {};

    if (isOrganizationSignup) {
      if (!organizationAimag.trim() || !organizationHot.trim()) {
        nextErrors.organizationRegion = "Аймаг / хот сонгоно уу.";
      }
      if (!organizationSum.trim()) {
        nextErrors.organizationSum = "Сум сонгоно уу.";
      }
      if (!organizationRegister.trim()) {
        nextErrors.organizationRegister =
          "Байгууллагын бүртгэлийн дугаар оруулна уу.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    if (password !== confirm) {
      setConfirmError("Нууц үг таарахгүй байна.");
      return;
    }

    setFetching(true);
    try {
      const { firstName: fnClerk, lastName: lnClerk } =
        clerkDisplayNameFromEmail(email);
      // Do not send `username` unless Username is enabled in Clerk — otherwise FAPI returns 422.
      const { error } = await signUp.password({
        emailAddress: email,
        password,
        firstName: fnClerk,
        lastName: lnClerk,
      });

      if (error) {
        setFormError(error.message ?? "Бүртгэл амжилтгүй.");
        return;
      }

      // Profile is saved after email verification (see onVerify). A mid-flow
      // signUp.update here can trigger empty API bodies with some Clerk/dev setups.
      await signUp.verifications.sendEmailCode();
      setStep("verify");
    } finally {
      setFetching(false);
    }
  }

  async function onVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (!signUp) return;

    const normalized = code.replace(/\s+/g, "").trim();
    if (!normalized) {
      setFormError("И-мэйлээс ирсэн кодыг оруулна уу.");
      return;
    }

    const orgAimag = organizationAimag.trim();
    const orgHot = organizationHot.trim();
    const orgSum = organizationSum.trim();
    const orgDetail = organizationAddressDetail.trim();
    const orgReg = organizationRegister.trim();

    setFetching(true);
    skipSignedInEffectRedirect.current = true;
    try {
      const { error: verifyErr } =
        await signUp.verifications.verifyEmailCode({
          code: normalized,
        });

      if (verifyErr?.message) {
        skipSignedInEffectRedirect.current = false;
        setFormError(verifyErr.message);
        return;
      }

      if (signUp.status !== "complete") {
        const raw = signUp as unknown as {
          missingFields?: string[];
          status?: string;
        };
        const missing = raw.missingFields?.length
          ? ` Дутуу: ${raw.missingFields.join(", ")}.`
          : "";
        skipSignedInEffectRedirect.current = false;
        setFormError(
          `Бүртгэл дуусаагүй байна (${String(raw.status)}).${missing} Кодоо шалгана уу эсвэл дахин илгээгээрэй.`,
        );
        return;
      }

      await activateSessionAndSaveExtras(
        orgAimag,
        orgHot,
        orgSum,
        orgDetail,
        orgReg,
      );
    } catch (caught: unknown) {
      skipSignedInEffectRedirect.current = false;
      const msg =
        caught &&
        typeof caught === "object" &&
        "errors" in caught &&
        Array.isArray((caught as { errors: { message?: string }[] }).errors)
          ? (caught as { errors: { message?: string }[] }).errors[0]?.message
          : caught instanceof Error
            ? caught.message
            : null;
      setFormError(
        msg ?? "Код буруу эсвэл хугацаа дууссан байж магадгүй. Дахин оролдоно уу.",
      );
    } finally {
      setFetching(false);
    }
  }

  async function onGoogleSignUp() {
    setFormError(null);
    if (!signUp) return;
    setFetching(true);
    try {
      const redirectUrl = absoluteAppUrlForPath(
        window.location.origin,
        oauthPostAuthRedirectUrl(afterAuthUrl),
      );
      const { error } = await signUp.sso({
        strategy: "oauth_google",
        redirectUrl,
        redirectCallbackUrl: authSsoCallbackFullUrl(window.location.origin),
      });
      if (error) {
        setFormError(error.message ?? "Google-ээр бүртгүүлэх амжилтгүй.");
      }
    } finally {
      setFetching(false);
    }
  }

  async function resendCode() {
    if (!signUp) return;
    setFetching(true);
    setFormError(null);
    try {
      await signUp.verifications.sendEmailCode();
    } catch (caught: unknown) {
      const msg =
        caught instanceof Error ? caught.message : "Код илгээхэд алдаа гарлаа.";
      setFormError(msg);
    } finally {
      setFetching(false);
    }
  }

  const signInHref = authSignInHref(afterAuthUrl);

  if (!isLoaded) {
    return (
      <div className="h-48 animate-pulse rounded-xl bg-gray-100" aria-hidden />
    );
  }

  /**
   * verify алхмыг `isSignedIn`-ээс өмнө: код баталгаажсаны дараа Clerk `isSignedIn`-ийг эхлүүлдэг,
   * харин `useEffect` verify үед шилжүүлдэггүй — хуучин дараалалд «Шилжиж байна» гогцоонд ороод байсан.
   */
  if (step === "verify") {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          И-мэйл баталгаажуулах
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Илгээсэн кодыг оруулна уу:{" "}
          <span className="font-medium text-gray-800">{email}</span>
        </p>

        <form className="mt-8 space-y-5" onSubmit={onVerify} noValidate>
          {/* Clerk bot protection: товчноос өмнө mount хийгдэх ёстой; verify мөрөн дээр мөн token шаардлагатай */}
          <div id="clerk-captcha" className="min-h-[1px]" />

          <AuthInput
            id="signup-code"
            label="Баталгаажуулах код"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={codeError}
            required
            disabled={loading}
          />

          {formError ? (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          ) : null}

          <AuthButton type="submit" disabled={loading}>
            {fetching ? "Баталгаажуулж байна…" : "Баталгаажуулах"}
          </AuthButton>
        </form>

        <button
          type="button"
          className="mt-4 w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900"
          onClick={resendCode}
          disabled={loading}
        >
          Код дахин илгээх
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
          Бүртгэлтэй юу?{" "}
          <Link
            href={signInHref}
            className="font-semibold text-gray-900 underline-offset-4 hover:underline"
          >
            Нэвтрэх
          </Link>
        </p>
      </div>
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
        Бүртгүүлэх
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {isOrganizationSignup
          ? "Захиргааны бүртгэл — аймаг/хот, сум, бүртгэлийн дугаар заавал; доорх хаягийг нэмж болно."
          : "И-мэйл, нууц үгээр бүртгүүлнэ. Бусад мэдээллийг дараа нь профайлаас бөглүүлж болно."}
      </p>

      <form className="mt-8 space-y-5" onSubmit={onCredentials} noValidate>
        <AuthInput
          id="signup-email"
          label="И-мэйл"
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

        {isOrganizationSignup ? (
          <>
            <OrganizationDivisionSelects
              organizationAimag={organizationAimag}
              organizationHot={organizationHot}
              organizationSum={organizationSum}
              onAimagHotChange={(a, h) => {
                setOrganizationAimag(a);
                setOrganizationHot(h);
                setOrganizationSum("");
              }}
              onSumChange={setOrganizationSum}
              fieldErrors={fieldErrors}
              disabled={loading}
            />
            <AuthInput
              id="signup-org-detail"
              label="Дэлгэрэнгүй хаяг"
              name="organizationAddressDetail"
              type="text"
              autoComplete="street-address"
              placeholder="Гудамж, байр, тоот (заавал биш)"
              value={organizationAddressDetail}
              onChange={(e) => setOrganizationAddressDetail(e.target.value)}
              disabled={loading}
            />
            <AuthInput
              id="signup-org-register"
              label="Байгууллагын бүртгэлийн дугаар"
              name="organizationRegister"
              type="text"
              autoComplete="off"
              placeholder="Жишээ: 1234567"
              value={organizationRegister}
              onChange={(e) => setOrganizationRegister(e.target.value)}
              error={fieldErrors.organizationRegister}
              required
              disabled={loading}
            />
          </>
        ) : null}

        <AuthInput
          id="signup-password"
          label="Нууц үг"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          required
          disabled={loading}
        />
        <AuthInput
          id="signup-confirm"
          label="Нууц үг давтах"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={confirmError ?? undefined}
          required
          disabled={loading}
        />

        {formError ? (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}

        {/* Clerk bot protection — must be in the DOM before sign-up requests */}
        <div id="clerk-captcha" className="min-h-[1px]" />

        <AuthButton type="submit" disabled={loading}>
          {fetching ? "Үргэлжлүүлж байна…" : "Бүртгүүлэх"}
        </AuthButton>
      </form>

      {!isOrganizationSignup ? (
        <>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs font-medium uppercase tracking-wide text-gray-400">
              <span className="bg-white px-3">эсвэл</span>
            </div>
          </div>

          <AuthButton
            type="button"
            variant="social"
            disabled={loading}
            onClick={onGoogleSignUp}
          >
            <GoogleIcon />
            Google-ээр үргэлжлүүлэх
          </AuthButton>
        </>
      ) : null}

      <p className="mt-8 text-center text-sm text-gray-500">
        Бүртгэлтэй юу?{" "}
        <Link
          href={signInHref}
          className="font-semibold text-gray-900 underline-offset-4 hover:underline"
        >
          Нэвтрэх
        </Link>
      </p>
    </div>
  );
}
