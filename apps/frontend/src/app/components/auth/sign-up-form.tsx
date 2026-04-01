/** @format */

"use client";

import { useAuth, useClerk, useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoChevronBack } from "react-icons/io5";
import { AuthButton } from "@/app/components/auth/auth-button";
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

/** Narrow shape from `useSignUp().signUp` after verify (passed in fresh to avoid stale closure). */
type SignUpAfterVerify = {
	status: string;
	createdSessionId: string | null;
	reload?: () => Promise<unknown>;
};

/** Redirect query can be correct while React state is one render behind — read live URL. */
function schoolSignupIntentFromCurrentUrl(): boolean {
	if (typeof window === "undefined") return false;
	const raw = new URLSearchParams(window.location.search).get(
		LOGIN_INTENT_QUERY_KEY,
	);
	return safeAuthRedirect(raw) === "/school";
}

const primaryBlue =
	"bg-[#29B6FF] hover:bg-[#20a8f2] active:bg-[#1899e6] text-white focus-visible:outline-[#29B6FF] focus-visible:outline-offset-2 cursor-pointer";
const inputClass =
	"h-14 w-full rounded-[14px] border border-gray-200 bg-white px-4 text-base text-gray-900 shadow-sm " +
	"placeholder:text-gray-400 focus:border-[#29B6FF] focus:outline-none focus:ring-2 focus:ring-[#29B6FF]/30 " +
	"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";

const authPanelClass =
	"box-border mx-auto flex h-[min(619px,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1rem))] max-h-[min(619px,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1rem))] min-h-0 w-full max-w-[540px] flex-col overflow-hidden rounded-none border border-gray-200/80 bg-white shadow-[0_8px_32px_rgba(15,20,27,0.06)] sm:mx-4 sm:h-[619px] sm:max-h-[min(619px,calc(100dvh-2rem))] sm:rounded-2xl";

/** Сургуулийн бүртгэл — илүү олон талбарт зай их */
const authPanelClassSchool =
	"box-border mx-auto flex h-[min(780px,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1rem))] max-h-[min(780px,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1rem))] min-h-0 w-full max-w-[540px] flex-col overflow-hidden rounded-none border border-gray-200/80 bg-white shadow-[0_8px_32px_rgba(15,20,27,0.06)] sm:mx-4 sm:h-[780px] sm:max-h-[min(780px,calc(100dvh-2rem))] sm:rounded-2xl";

type BackAction = { href: string } | { onBack: () => void };

/** Нэвтрэх холбоосны доор — sign-in-тай ижил */
function AuthBrandMark() {
	return (
		<div className="mt-8 flex items-center justify-center gap-2 pb-[env(safe-area-inset-bottom)]">
			<Image
				src="/bee.png"
				alt=""
				width={40}
				height={40}
				className="h-9 w-9 object-contain"
			/>
			<span className="text-lg font-black tracking-tight text-[#11161d]">
				UPDATE
			</span>
		</div>
	);
}

/** flex-1 биш — өндрийг контентоор тогтооно, гаднах нь overflow-y-auto-оор гүйлгэнэ */
const signupBodyInnerClass =
	"flex min-h-0 w-full min-w-0 flex-col justify-start pt-2 pb-2";

function SignUpScreenFrame({
	title,
	back,
	children,
	schoolSignup = false,
	contentClassName,
}: {
	title: string;
	back: BackAction;
	children: ReactNode;
	schoolSignup?: boolean;
	contentClassName?: string;
}) {
	const backBtnClass =
		"inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-200/80";
	const innerClass = contentClassName ?? signupBodyInnerClass;

	return (
		<div className="flex min-h-svh flex-col items-stretch justify-center overflow-x-hidden overflow-y-auto bg-[#f4f4ee] px-0 py-0 sm:items-center sm:p-4">
			<div
				className={`my-auto min-h-0 w-full ${schoolSignup ? authPanelClassSchool : authPanelClass}`}
			>
				<header className="flex shrink-0 items-center px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-8">
					{"href" in back ? (
						<Link
							href={back.href}
							className={`${backBtnClass} shrink-0`}
							aria-label="Буцах"
						>
							<IoChevronBack className="h-6 w-6" aria-hidden />
						</Link>
					) : (
						<button
							type="button"
							onClick={back.onBack}
							className={`${backBtnClass} shrink-0`}
							aria-label="Буцах"
						>
							<IoChevronBack className="h-6 w-6" aria-hidden />
						</button>
					)}
					<h1 className="min-w-0 flex-1 text-center text-lg font-bold tracking-tight text-gray-900">
						{title}
					</h1>
					<span className="inline-block h-10 w-10 shrink-0" aria-hidden />
				</header>

				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-5 pb-6 [touch-action:pan-y] sm:px-8 sm:pb-8">
					<div className={innerClass}>{children}</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Овог/нэр маягтаас авахгүй — Clerk-д placeholder нэр дамжуулна.
 * Ижил firstName + lastName ихэнх тохиолдолд FAPI 422 буцаадаг тул тусад нь өгнө.
 */
function clerkDisplayNameFromEmail(emailAddr: string): {
	firstName: string;
	lastName: string;
} {
	const raw = emailAddr.split("@")[0]?.trim() || "member";
	const safe =
		raw
			.replace(/[^a-zA-Z0-9._-]/g, "_")
			.replace(/_+/g, "_")
			.replace(/^_|_$/g, "")
			.slice(0, 40) || "member";
	const firstName = safe.slice(0, 38);
	let lastName = "User";
	if (firstName.toLowerCase() === lastName.toLowerCase()) {
		lastName = "Account";
	}
	return { firstName, lastName };
}

export function SignUpForm() {
	const searchParams = useSearchParams();
	const afterAuthUrl = useMemo(
		() => safeAuthRedirect(searchParams.get(LOGIN_INTENT_QUERY_KEY)),
		[searchParams],
	);
	const isOrganizationSignup = afterAuthUrl === "/school";

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
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
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

	const skipSignedInEffectRedirect = useRef(false);

	useEffect(() => {
		if (!isLoaded || !isSignedIn) return;
		if (step === "verify") return;
		if (skipSignedInEffectRedirect.current) return;
		hardNavigateToAppPath(dashboardUrl);
	}, [dashboardUrl, isLoaded, isSignedIn, step]);

	const activateSessionAndSaveExtras = useCallback(
		async (
			/** Pass the `signUp` from `onVerify` after verify succeeds — avoids stale `useCallback` closure. */
			activeSignUp: SignUpAfterVerify,
			orgAimag: string,
			orgHot: string,
			orgSum: string,
			orgDetail: string,
			orgReg: string,
			signupEmail: string,
		) => {
			if (!activeSignUp || activeSignUp.status !== "complete") return;
			let sessionId = activeSignUp.createdSessionId;
			if (!sessionId) {
				await clerkTryReloadSessionResource(activeSignUp);
				sessionId = activeSignUp.createdSessionId;
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

			const sleep = (ms: number) =>
				new Promise<void>((resolve) => {
					setTimeout(resolve, ms);
				});

			if (hasAnyOrganizationSignupField(a, h, s, d, r)) {
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
				/**
				 * Clerk `user.updated` webhooks fire reliably off the Backend API.
				 * Browser-only `user.update` often does not trigger the same delivery to Workers.
				 */
				try {
					const serverSave = await saveSignUpProfileExtras(a, h, s, d, r);
					if (!serverSave.ok) {
						console.error(
							"[sign-up] saveSignUpProfileExtras:",
							serverSave.message,
						);
					}
				} catch (err) {
					console.error("[sign-up] saveSignUpProfileExtras:", err);
				}
			}

			/** School row is synced to D1 via Clerk `user.updated` webhook (unsafeMetadata). */

			hardNavigateToAppPath(oauthPostAuthRedirectUrl(afterAuthUrl));
		},
		[afterAuthUrl, clerk, isOrganizationSignup],
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
			const emailTrimmed = email.trim();
			const { firstName: fnClerk, lastName: lnClerk } =
				clerkDisplayNameFromEmail(emailTrimmed);
			const { error } = await signUp.password({
				emailAddress: emailTrimmed,
				password,
				firstName: fnClerk,
				lastName: lnClerk,
			});

			if (error) {
				setFormError(error.message ?? "Бүртгэл амжилтгүй.");
				return;
			}

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
			const { error: verifyErr } = await signUp.verifications.verifyEmailCode({
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
				signUp,
				orgAimag,
				orgHot,
				orgSum,
				orgDetail,
				orgReg,
				email.trim(),
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
				msg ??
					"Код буруу эсвэл хугацаа дууссан байж магадгүй. Дахин оролдоно уу.",
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

	function backToCredentials() {
		setStep("credentials");
		setFormError(null);
		setCode("");
	}

	const signInHref = authSignInHref(afterAuthUrl);

	if (!isLoaded) {
		return (
			<SignUpScreenFrame
				title="Бүртгүүлэх"
				back={{ href: "/" }}
				schoolSignup={isOrganizationSignup}
			>
				<div
					className="h-96 animate-pulse rounded-2xl bg-gray-200/70"
					aria-hidden
				/>
			</SignUpScreenFrame>
		);
	}

	if (step === "verify") {
		return (
			<SignUpScreenFrame
				title="И-мэйл баталгаажуулах"
				back={{ onBack: backToCredentials }}
				schoolSignup={isOrganizationSignup}
			>
				<p className="mb-6 text-center text-sm text-gray-600">
					Илгээсэн кодыг оруулна уу:{" "}
					<span className="font-medium text-gray-800">{email}</span>
				</p>

				<form className="flex flex-col gap-4" onSubmit={onVerify} noValidate>
					<div id="clerk-captcha" className="min-h-[1px]" />

					<div>
						<label htmlFor="signup-code" className="sr-only">
							Баталгаажуулах код
						</label>
						<input
							id="signup-code"
							name="code"
							type="text"
							inputMode="numeric"
							autoComplete="one-time-code"
							placeholder="Баталгаажуулах код"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className={inputClass}
							required
							disabled={loading}
							aria-invalid={Boolean(codeError)}
							aria-describedby={codeError ? "signup-code-error" : undefined}
						/>
						{codeError ? (
							<p
								id="signup-code-error"
								className="mt-1.5 text-sm text-red-600"
								role="alert"
							>
								{codeError}
							</p>
						) : null}
					</div>

					{formError ? (
						<p className="text-sm text-red-600" role="alert">
							{formError}
						</p>
					) : null}

					<AuthButton
						type="submit"
						disabled={loading}
						className={`mt-1 h-14 rounded-[14px] text-base font-bold ${primaryBlue}`}
					>
						{fetching ? "Баталгаажуулж байна…" : "Баталгаажуулах"}
					</AuthButton>
				</form>

				<button
					type="button"
					className="mt-5 w-full text-center text-sm font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
					onClick={resendCode}
					disabled={loading}
				>
					Код дахин илгээх
				</button>

				<Link
					href={signInHref}
					className="mt-8 block text-center text-base font-bold text-gray-800 underline-offset-2 hover:underline"
				>
					Нэвтрэх
				</Link>
				<AuthBrandMark />
			</SignUpScreenFrame>
		);
	}

	if (isSignedIn) {
		return (
			<SignUpScreenFrame title="Бүртгүүлэх" back={{ href: "/" }}>
				<p className="text-center text-sm text-gray-600">
					Та аль хэдийн нэвтэрсэн байна. Шилжиж байна…
				</p>
			</SignUpScreenFrame>
		);
	}

	return (
		<SignUpScreenFrame
			title="Бүртгүүлэх"
			back={{ href: "/" }}
			schoolSignup={isOrganizationSignup}
		>
			{isOrganizationSignup ? (
				<p className="mb-5 text-center text-sm text-gray-500">
					Захиргааны бүртгэл — аймаг/хот, сум, бүртгэлийн дугаар заавал.
				</p>
			) : null}

			<form className="flex flex-col gap-4" onSubmit={onCredentials} noValidate>
				<div>
					<label htmlFor="signup-email" className="sr-only">
						И-мэйл
					</label>
					<input
						id="signup-email"
						name="email"
						type="email"
						autoComplete="email"
						placeholder="Имэйл хаяг"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={inputClass}
						required
						disabled={loading}
						aria-invalid={Boolean(emailError)}
						aria-describedby={emailError ? "signup-email-error" : undefined}
					/>
					{emailError ? (
						<p
							id="signup-email-error"
							className="mt-1.5 text-sm text-red-600"
							role="alert"
						>
							{emailError}
						</p>
					) : null}
				</div>

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
							compactAuth
						/>
						<div>
							<label
								htmlFor="signup-org-detail"
								className="mb-1.5 block text-xs font-medium text-gray-600"
							>
								Дэлгэрэнгүй хаяг
							</label>
							<input
								id="signup-org-detail"
								name="organizationAddressDetail"
								type="text"
								autoComplete="street-address"
								placeholder="Гудамж, байр, тоот (заавал биш)"
								value={organizationAddressDetail}
								onChange={(e) => setOrganizationAddressDetail(e.target.value)}
								className={inputClass}
								disabled={loading}
							/>
						</div>
						<div>
							<label
								htmlFor="signup-org-register"
								className="mb-1.5 block text-xs font-medium text-gray-600"
							>
								Байгууллагын бүртгэлийн дугаар
							</label>
							<input
								id="signup-org-register"
								name="organizationRegister"
								type="text"
								autoComplete="off"
								placeholder="Жишээ: 1234567"
								value={organizationRegister}
								onChange={(e) => setOrganizationRegister(e.target.value)}
								className={inputClass}
								required
								disabled={loading}
								aria-invalid={Boolean(fieldErrors.organizationRegister)}
								aria-describedby={
									fieldErrors.organizationRegister
										? "signup-org-register-error"
										: undefined
								}
							/>
							{fieldErrors.organizationRegister ? (
								<p
									id="signup-org-register-error"
									className="mt-1.5 text-sm text-red-600"
									role="alert"
								>
									{fieldErrors.organizationRegister}
								</p>
							) : null}
						</div>
					</>
				) : null}

				<div>
					<label htmlFor="signup-password" className="sr-only">
						Нууц үг
					</label>
					<div className="relative">
						<input
							id="signup-password"
							name="password"
							type={showPassword ? "text" : "password"}
							autoComplete="new-password"
							placeholder="Нууц үг"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={`${inputClass} pr-12`}
							required
							disabled={loading}
							aria-invalid={Boolean(passwordError)}
							aria-describedby={
								passwordError ? "signup-password-error" : undefined
							}
						/>
						<button
							type="button"
							className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
							onClick={() => setShowPassword((v) => !v)}
							disabled={loading}
							aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харуулах"}
						>
							{showPassword ? (
								<AiOutlineEyeInvisible className="h-5 w-5" aria-hidden />
							) : (
								<AiOutlineEye className="h-5 w-5" aria-hidden />
							)}
						</button>
					</div>
					{passwordError ? (
						<p
							id="signup-password-error"
							className="mt-1.5 text-sm text-red-600"
							role="alert"
						>
							{passwordError}
						</p>
					) : null}
				</div>

				<div>
					<label htmlFor="signup-confirm" className="sr-only">
						Нууц үг давтах
					</label>
					<div className="relative">
						<input
							id="signup-confirm"
							name="confirm"
							type={showConfirm ? "text" : "password"}
							autoComplete="new-password"
							placeholder="Нууц үг давтах"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							className={`${inputClass} pr-12`}
							required
							disabled={loading}
							aria-invalid={Boolean(confirmError)}
							aria-describedby={
								confirmError ? "signup-confirm-error" : undefined
							}
						/>
						<button
							type="button"
							className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
							onClick={() => setShowConfirm((v) => !v)}
							disabled={loading}
							aria-label={showConfirm ? "Нууц үг нуух" : "Нууц үг харуулах"}
						>
							{showConfirm ? (
								<AiOutlineEyeInvisible className="h-5 w-5" aria-hidden />
							) : (
								<AiOutlineEye className="h-5 w-5" aria-hidden />
							)}
						</button>
					</div>
					{confirmError ? (
						<p
							id="signup-confirm-error"
							className="mt-1.5 text-sm text-red-600"
							role="alert"
						>
							{confirmError}
						</p>
					) : null}
				</div>

				{formError ? (
					<p className="text-sm text-red-600" role="alert">
						{formError}
					</p>
				) : null}

				<div id="clerk-captcha" className="min-h-[1px]" />

				<AuthButton
					type="submit"
					disabled={loading}
					className={`mt-1 h-14 rounded-[14px] text-base font-bold ${primaryBlue}`}
				>
					{fetching ? "Үргэлжлүүлж байна…" : "Бүртгүүлэх"}
				</AuthButton>
			</form>

			{!isOrganizationSignup ? (
				<AuthButton
					type="button"
					variant="social"
					disabled={loading}
					onClick={onGoogleSignUp}
					className="mt-6 h-14 rounded-[14px] border-[#29B6FF] bg-white text-base font-semibold text-[#29B6FF] shadow-none hover:bg-[#f0f9ff] cursor-pointer"
				>
					Google-ээр бүртгүүлэх
				</AuthButton>
			) : null}

			<Link
				href={signInHref}
				className="mt-8 block text-center text-base font-bold text-gray-800 underline-offset-2 hover:underline"
			>
				Нэвтрэх
			</Link>
			<AuthBrandMark />
		</SignUpScreenFrame>
	);
}
