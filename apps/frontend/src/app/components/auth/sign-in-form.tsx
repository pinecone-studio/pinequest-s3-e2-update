/** @format */

"use client";

import { useAuth, useClerk, useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoChevronBack } from "react-icons/io5";
import { AuthButton } from "@/app/components/auth/auth-button";
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

/** Clerk SignInFuture — нууц үгийн дараах MFA / client trust алхмууд */
type SignInSecondFactor = { strategy: string };
type SignInWithMfa = {
	supportedSecondFactors?: SignInSecondFactor[] | null;
	status?: string | null;
	mfa?: {
		sendPhoneCode: () => Promise<{ error: { message?: string } | null }>;
		sendEmailCode: () => Promise<{ error: { message?: string } | null }>;
		verifyPhoneCode: (p: {
			code: string;
		}) => Promise<{ error: { message?: string } | null }>;
		verifyEmailCode: (p: {
			code: string;
		}) => Promise<{ error: { message?: string } | null }>;
		verifyTOTP: (p: {
			code: string;
		}) => Promise<{ error: { message?: string } | null }>;
		verifyBackupCode: (p: {
			code: string;
		}) => Promise<{ error: { message?: string } | null }>;
	};
	finalize?: (opts?: {
		navigate?: (args: { session: unknown }) => void | Promise<void>;
	}) => Promise<{ error: { message?: string } | null }>;
	reset?: () => Promise<{ error: unknown } | null | void>;
};

function clerkErrMessage(err: unknown): string {
	if (err && typeof err === "object" && "message" in err) {
		const m = (err as { message?: string }).message;
		if (typeof m === "string" && m) return m;
	}
	return "Алдаа гарлаа. Дахин оролдоно уу.";
}

function mfaStrategyLabel(strategy: string): string {
	switch (strategy) {
		case "totp":
			return "Authenticator апп (TOTP)";
		case "phone_code":
			return "Утасны SMS код";
		case "email_code":
			return "И-мэйл код";
		default:
			return strategy;
	}
}

/** Эх зурган дээрх тод cyan/sky цэнхэр. */
const primaryBlue =
	"bg-[#29B6FF] hover:bg-[#20a8f2] active:bg-[#1899e6] text-white focus-visible:outline-[#29B6FF] focus-visible:outline-offset-2";
const inputClass =
	"h-14 w-full rounded-[14px] border border-gray-200 bg-white px-4 text-base text-gray-900 shadow-sm " +
	"placeholder:text-gray-400 focus:border-[#29B6FF] focus:outline-none focus:ring-2 focus:ring-[#29B6FF]/30 " +
	"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";

/** Дэлгэц дээр төвлөрсөн нэвтрэх самбарын хэмжээ */
const authPanelClass =
	"box-border mx-auto flex h-[min(619px,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1rem))] w-full max-w-[540px] flex-col overflow-hidden rounded-none border border-gray-200/80 bg-white shadow-[0_8px_32px_rgba(15,20,27,0.06)] sm:mx-4 sm:h-[619px] sm:max-h-[min(619px,calc(100dvh-2rem))] sm:rounded-2xl";

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
	const mfaAutoSendStarted = useRef(false);
	const mfaStrategyInitialized = useRef(false);
	const [fetching, setFetching] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	/** Нууц үг баталгаажсаны дараах нэмэлт баталгаажуулалт (MFA, итгэх төхөөрөмж г.м.) */
	const [secondFactorPending, setSecondFactorPending] = useState(false);
	const [selectedMfaStrategy, setSelectedMfaStrategy] = useState<string>("");
	const [mfaCode, setMfaCode] = useState("");
	const [useBackupCode, setUseBackupCode] = useState(false);
	const [mfaHint, setMfaHint] = useState<string | null>(null);

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

	useEffect(() => {
		if (!secondFactorPending || !signIn) return;
		const si = signIn as SignInWithMfa;
		if (mfaStrategyInitialized.current) return;
		const factors = si.supportedSecondFactors ?? [];
		const nonBackup = factors.filter((f) => f.strategy !== "backup_code");
		if (si.status === "needs_client_trust") {
			setSelectedMfaStrategy("email_code");
			mfaStrategyInitialized.current = true;
			return;
		}
		if (nonBackup.length > 0) {
			setSelectedMfaStrategy(nonBackup[0]!.strategy);
			mfaStrategyInitialized.current = true;
			return;
		}
		if (si.status === "needs_second_factor") {
			setSelectedMfaStrategy("totp");
			mfaStrategyInitialized.current = true;
		}
	}, [secondFactorPending, signIn]);

	useEffect(() => {
		if (!secondFactorPending || !signIn) return;
		const si = signIn as SignInWithMfa;
		const status = si.status ?? "";
		if (status !== "needs_second_factor" && status !== "needs_client_trust")
			return;
		if (!si.mfa || mfaAutoSendStarted.current) return;
		mfaAutoSendStarted.current = true;

		void (async () => {
			if (status === "needs_client_trust") {
				const { error } = await si.mfa!.sendEmailCode();
				if (error) setMfaHint(clerkErrMessage(error));
				else
					setMfaHint(
						"Таны и-мэйл хаяг руу баталгаажуулах код илгээлээ. Спам хавтсыг шалгана уу.",
					);
				return;
			}
			const factors = si.supportedSecondFactors ?? [];
			const hasPhone = factors.some((f) => f.strategy === "phone_code");
			const hasEmail = factors.some((f) => f.strategy === "email_code");
			const hasTotp = factors.some((f) => f.strategy === "totp");

			if (hasTotp && !hasPhone && !hasEmail) {
				setMfaHint("Authenticator апп-аас 6 оронтой кодоо оруулна уу.");
				return;
			}
			if (hasPhone) {
				const { error } = await si.mfa!.sendPhoneCode();
				if (error) setMfaHint(clerkErrMessage(error));
				else setMfaHint("Утасны дугаар руу SMS код илгээлээ.");
				return;
			}
			if (hasEmail) {
				const { error } = await si.mfa!.sendEmailCode();
				if (error) setMfaHint(clerkErrMessage(error));
				else setMfaHint("И-мэйл хаяг руу код илгээлээ.");
			}
		})();
	}, [secondFactorPending, signIn]);

	const exitSecondFactor = useCallback(async () => {
		const si = signIn as SignInWithMfa | undefined;
		if (si && typeof si.reset === "function") {
			await si.reset();
		}
		setSecondFactorPending(false);
		setMfaCode("");
		setMfaHint(null);
		setUseBackupCode(false);
		setFormError(null);
		mfaAutoSendStarted.current = false;
		mfaStrategyInitialized.current = false;
	}, [signIn]);

	async function resendMfaCode() {
		const si = signIn as SignInWithMfa;
		if (!si.mfa) return;
		setMfaHint(null);
		setFormError(null);
		setFetching(true);
		try {
			if (selectedMfaStrategy === "phone_code") {
				const { error } = await si.mfa.sendPhoneCode();
				setMfaHint(
					error ? clerkErrMessage(error) : "SMS код дахин илгээлээ.",
				);
			} else if (
				selectedMfaStrategy === "email_code" ||
				si.status === "needs_client_trust"
			) {
				const { error } = await si.mfa.sendEmailCode();
				setMfaHint(
					error ? clerkErrMessage(error) : "И-мэйл код дахин илгээлээ.",
				);
			}
		} finally {
			setFetching(false);
		}
	}

	async function onMfaSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setFormError(null);
		const si = signIn as SignInWithMfa;
		if (!si.mfa) {
			setFormError(
				"Нэвтрэлтийн систем бэлэн биш байна. Хуудсыг дахин ачаална уу.",
			);
			return;
		}
		const code = mfaCode.trim();
		if (!code) {
			setFormError("Баталгаажуулах кодоо оруулна уу.");
			return;
		}
		setFetching(true);
		skipSignedInEffectRedirect.current = true;
		try {
			let result: { error: { message?: string } | null } | undefined;
			if (useBackupCode) {
				result = await si.mfa.verifyBackupCode({ code });
			} else {
				const strat =
					si.status === "needs_client_trust"
						? "email_code"
						: selectedMfaStrategy;
				if (strat === "totp") result = await si.mfa.verifyTOTP({ code });
				else if (strat === "phone_code")
					result = await si.mfa.verifyPhoneCode({ code });
				else if (strat === "email_code")
					result = await si.mfa.verifyEmailCode({ code });
				else {
					skipSignedInEffectRedirect.current = false;
					setFormError("Энэ баталгаажуулах төрлийг дэмжихгүй байна.");
					return;
				}
			}
			if (result?.error) {
				skipSignedInEffectRedirect.current = false;
				setFormError(clerkErrMessage(result.error));
				return;
			}
			if (signIn.status === "complete") {
				try {
					await completeSignInSession();
				} catch (caught: unknown) {
					skipSignedInEffectRedirect.current = false;
					setFormError(
						caught instanceof Error
							? caught.message
							: "Нэвтрэхэд алдаа гарлаа.",
					);
				}
			} else {
				skipSignedInEffectRedirect.current = false;
				setFormError(
					"Баталгаажуулалт дуусаагүй байна. Код эсвэл нууц үгөө шалгана уу.",
				);
			}
		} finally {
			setFetching(false);
		}
	}

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

	const completeSignInSession = useCallback(async () => {
		const si = signIn as SignInWithMfa | null | undefined;
		if (!si || si.status !== "complete") return;
		if (typeof si.finalize === "function") {
			const { error } = await si.finalize({
				navigate: async () => {
					hardNavigateToAppPath(oauthPostAuthRedirectUrl(afterAuthUrl));
				},
			});
			if (!error) return;
		}
		await activateSessionAndRedirect();
	}, [afterAuthUrl, activateSessionAndRedirect, signIn]);

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
				identifier: email.trim(),
				password,
			} as { identifier: string; password: string });

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
					await completeSignInSession();
				} catch (caught: unknown) {
					skipSignedInEffectRedirect.current = false;
					const msg =
						caught instanceof Error
							? caught.message
							: "Нэвтрэхэд алдаа гарлаа.";
					setFormError(msg);
				}
			} else if (
				signIn.status === "needs_second_factor" ||
				signIn.status === "needs_client_trust"
			) {
				skipSignedInEffectRedirect.current = false;
				setFormError(null);
				setMfaHint(null);
				setMfaCode("");
				setUseBackupCode(false);
				mfaAutoSendStarted.current = false;
				mfaStrategyInitialized.current = false;
				setSecondFactorPending(true);
			} else {
				skipSignedInEffectRedirect.current = false;
				setFormError(
					"Нэвтрэлт дуусаагүй байна. И-мэйлээ баталгаажуулсан эсэхээ шалгана уу.",
				);
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
	const siForMfaUi = signIn as SignInWithMfa;
	const mfaSelectableFactors = (siForMfaUi.supportedSecondFactors ?? []).filter(
		(f) => f.strategy !== "backup_code",
	);

	if (!isLoaded) {
		return (
			<div
				className="flex min-h-screen flex-col items-stretch justify-center bg-[#f4f4ee] px-0 py-0 sm:items-center sm:p-4"
				aria-busy="true"
				aria-label="Уншиж байна"
			>
				<div className={`${authPanelClass} p-5 sm:p-8`}>
					<div className="h-full animate-pulse rounded-xl bg-gray-100" />
				</div>
			</div>
		);
	}

	if (isSignedIn) {
		return (
			<div className="flex min-h-screen flex-col items-stretch justify-center bg-[#f4f4ee] px-0 py-0 sm:items-center sm:p-4">
				<div className={`${authPanelClass} items-center justify-center px-5 sm:px-8`}>
					<p className="text-center text-sm text-gray-600">
						Та аль хэдийн нэвтэрсэн байна. Шилжиж байна…
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col items-stretch justify-center bg-[#f4f4ee] px-0 py-0 sm:items-center sm:p-4">
			<div className={authPanelClass}>
				<header className="flex shrink-0 items-center px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-8">
					{secondFactorPending ? (
						<button
							type="button"
							className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-200/80"
							aria-label="Буцах"
							disabled={loading}
							onClick={() => void exitSecondFactor()}
						>
							<IoChevronBack className="h-6 w-6" aria-hidden />
						</button>
					) : (
						<Link
							href="/"
							className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-200/80"
							aria-label="Буцах"
						>
							<IoChevronBack className="h-6 w-6" aria-hidden />
						</Link>
					)}
					<h1 className="min-w-0 flex-1 text-center text-lg font-bold tracking-tight text-gray-900">
						{secondFactorPending ? "Нэмэлт баталгаа" : "Нэвтрэх"}
					</h1>
					<span className="inline-block h-10 w-10 shrink-0" aria-hidden />
				</header>

				<div className="flex min-h-0 flex-1 flex-col px-5 pb-6 sm:px-8 sm:pb-8">
					<div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-2">
						{secondFactorPending ? (
							!(signIn as SignInWithMfa).mfa ? (
								<div className="space-y-4 text-center">
									<p className="text-sm text-red-600" role="alert">
										Нэмэлт баталгаажуулалтыг энэ хувилбар дэмжихгүй байна. Хуудсыг
										дахин ачаалж, эсвэл тохиргоог шалгана уу.
									</p>
									<button
										type="button"
										className={`h-12 w-full rounded-[14px] text-sm font-semibold ${primaryBlue}`}
										onClick={() => void exitSecondFactor()}
									>
										Буцах
									</button>
								</div>
							) : (
							<form
								className="flex flex-col gap-4"
								onSubmit={onMfaSubmit}
								noValidate
							>
								<p className="text-center text-sm leading-relaxed text-gray-600">
									{(signIn as SignInWithMfa).status === "needs_client_trust"
										? "Шинэ эсвэл итгэж болохгүй төхөөрөмжөөс нэвтэрч байна. И-мэйлээр илгээсэн кодоо оруулна уу."
										: "Бүртгэлд тохируулсан хоёр алхамт баталгаажуулалт эсвэл нөөц код шаардлагатай."}
								</p>
								{mfaHint ? (
									<p className="text-center text-sm text-gray-700">{mfaHint}</p>
								) : null}
								{(signIn as SignInWithMfa).status !== "needs_client_trust" &&
								mfaSelectableFactors.length > 1 &&
								!useBackupCode ? (
									<div>
										<label
											htmlFor="signin-mfa-strategy"
											className="mb-1.5 block text-sm font-medium text-gray-700"
										>
											Баталгаажуулах арга
										</label>
										<select
											id="signin-mfa-strategy"
											className={inputClass}
											value={selectedMfaStrategy}
											onChange={(e) => setSelectedMfaStrategy(e.target.value)}
											disabled={loading}
										>
											{mfaSelectableFactors.map((f) => (
												<option key={f.strategy} value={f.strategy}>
													{mfaStrategyLabel(f.strategy)}
												</option>
											))}
										</select>
									</div>
								) : null}
								<div className="flex items-center gap-2">
									<input
										id="signin-backup-code"
										type="checkbox"
										className="h-4 w-4 rounded border-gray-300"
										checked={useBackupCode}
										onChange={(e) => {
											setUseBackupCode(e.target.checked);
											setMfaCode("");
										}}
										disabled={loading}
									/>
									<label
										htmlFor="signin-backup-code"
										className="text-sm text-gray-700"
									>
										Нөөц (backup) код ашиглах
									</label>
								</div>
								<div>
									<label htmlFor="signin-mfa-code" className="sr-only">
										Баталгаажуулах код
									</label>
									<input
										id="signin-mfa-code"
										name="code"
										type="text"
										inputMode="numeric"
										autoComplete="one-time-code"
										placeholder={
											useBackupCode
												? "Нөөц код"
												: selectedMfaStrategy === "totp"
													? "6 оронтой код"
													: "Илгээсэн код"
										}
										value={mfaCode}
										onChange={(e) => setMfaCode(e.target.value)}
										className={inputClass}
										required
										disabled={loading}
									/>
								</div>
								{(selectedMfaStrategy === "phone_code" ||
									selectedMfaStrategy === "email_code" ||
									(signIn as SignInWithMfa).status ===
										"needs_client_trust") &&
								!useBackupCode ? (
									<button
										type="button"
										className="text-sm font-medium text-[#29B6FF] underline-offset-2 hover:underline"
										onClick={() => void resendMfaCode()}
										disabled={loading}
									>
										Код дахин авах
									</button>
								) : null}
								{formError ? (
									<p className="text-sm text-red-600" role="alert">
										{formError}
									</p>
								) : null}
								<AuthButton
									type="submit"
									disabled={loading}
									className={`mt-1 h-14 cursor-pointer rounded-[14px] text-base font-bold ${primaryBlue}`}
								>
									{fetching ? "Шалгаж байна…" : "Баталгаажуулах"}
								</AuthButton>
							</form>
							)
						) : (
						<form
							className="flex flex-col gap-4"
							onSubmit={onSubmit}
							noValidate
						>
							<div>
								<label htmlFor="signin-identifier" className="sr-only">
									Имэйл эсвэл утас
								</label>
								<input
									id="signin-identifier"
									name="identifier"
									type="text"
									autoComplete="username"
									inputMode="email"
									placeholder="Имэйл эсвэл утасны дугаар"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={inputClass}
									required
									disabled={loading}
									aria-invalid={Boolean(emailError)}
									aria-describedby={
										emailError ? "signin-identifier-error" : undefined
									}
								/>
								{emailError ? (
									<p
										id="signin-identifier-error"
										className="mt-1.5 text-sm text-red-600"
										role="alert"
									>
										{emailError}
									</p>
								) : null}
							</div>

							<div>
								<label htmlFor="signin-password" className="sr-only">
									Нууц үг
								</label>
								<div className="relative">
									<input
										id="signin-password"
										name="password"
										type={showPassword ? "text" : "password"}
										autoComplete="current-password"
										placeholder="Нууц үг"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className={`${inputClass} pr-12`}
										required
										disabled={loading}
										aria-invalid={Boolean(passwordError)}
										aria-describedby={
											passwordError ? "signin-password-error" : undefined
										}
									/>
									<button
										type="button"
										className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
										onClick={() => setShowPassword((v) => !v)}
										disabled={loading}
										aria-label={
											showPassword ? "Нууц үг нуух" : "Нууц үг харуулах"
										}
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
										id="signin-password-error"
										className="mt-1.5 text-sm text-red-600"
										role="alert"
									>
										{passwordError}
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
								className={`mt-1 h-14 rounded-[14px] text-base cursor-pointer font-bold ${primaryBlue}`}
							>
								{fetching ? "Нэвтэрч байна…" : "Нэвтрэх"}
							</AuthButton>
						</form>
						)}

						{secondFactorPending ? null : (
							<>
						<Link
							href="/forgot-password"
							className="mt-5 block text-center text-sm font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
						>
							Нууц үгээ мартсан уу?
						</Link>

						<AuthButton
							type="button"
							variant="social"
							disabled={loading}
							onClick={onGoogle}
							className="cursor-pointer mt-6 h-14 rounded-[14px] border-[#29B6FF] bg-white text-base font-semibold text-[#29B6FF] shadow-none hover:bg-[#f0f9ff]"
						>
							Google-ээр нэвтрэх
						</AuthButton>

						<Link
							href={signUpHref}
							className="mt-8 block text-center text-base font-bold text-gray-800 underline-offset-2 hover:underline"
						>
							Бүртгүүлэх
						</Link>
							</>
						)}

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
					</div>
				</div>
			</div>
		</div>
	);
}
