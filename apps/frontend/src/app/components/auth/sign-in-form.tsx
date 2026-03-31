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

/** Эх зурган дээрх тод cyan/sky цэнхэр. */
const primaryBlue =
	"bg-[#29B6FF] hover:bg-[#20a8f2] active:bg-[#1899e6] text-white focus-visible:outline-[#29B6FF] focus-visible:outline-offset-2";
const inputClass =
	"h-14 w-full rounded-[14px] border border-gray-200 bg-white px-4 text-base text-gray-900 shadow-sm " +
	"placeholder:text-gray-400 focus:border-[#29B6FF] focus:outline-none focus:ring-2 focus:ring-[#29B6FF]/30 " +
	"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";

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
	const [showPassword, setShowPassword] = useState(false);
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
					await activateSessionAndRedirect();
				} catch (caught: unknown) {
					skipSignedInEffectRedirect.current = false;
					const msg =
						caught instanceof Error
							? caught.message
							: "Нэвтрэхэд алдаа гарлаа.";
					setFormError(msg);
				}
			} else if (signIn.status === "needs_second_factor") {
				skipSignedInEffectRedirect.current = false;
				setFormError(
					"Additional verification required. Use the prebuilt flow or enable a simpler MFA setup.",
				);
			} else if (signIn.status === "needs_client_trust") {
				skipSignedInEffectRedirect.current = false;
				setFormError(
					"This device needs extra verification. Check your email for a code.",
				);
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

	if (!isLoaded) {
		return (
			<div
				className="flex min-h-screen flex-col bg-[#f7f7f7]"
				aria-busy="true"
				aria-label="Уншиж байна"
			>
				<div className="mx-auto w-full max-w-md flex-1 px-5 py-6">
					<div className="h-96 animate-pulse rounded-2xl bg-gray-200/70" />
				</div>
			</div>
		);
	}

	if (isSignedIn) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f7] px-5">
				<p className="text-center text-sm text-gray-600">
					Та аль хэдийн нэвтэрсэн байна. Шилжиж байна…
				</p>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-[#f7f7f7]">
			<header className="relative flex h-14 shrink-0 items-center justify-center px-5 pt-[env(safe-area-inset-top)]">
				<Link
					href="/"
					className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-200/80"
					aria-label="Буцах"
				>
					<IoChevronBack className="h-6 w-6" aria-hidden />
				</Link>
				<h1 className="text-lg font-bold tracking-tight text-gray-900">
					Нэвтрэх
				</h1>
			</header>

			<div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10">
				<div className="flex flex-1 flex-col justify-center">
					<form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
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
						<GoogleIcon />
						Google-ээр нэвтрэх
					</AuthButton>

					<Link
						href={signUpHref}
						className="mt-8 block text-center text-base font-bold text-gray-800 underline-offset-2 hover:underline"
					>
						Бүртгүүлэх
					</Link>
				</div>

				<footer className="mt-auto flex shrink-0 items-center justify-center gap-2 pt-10 pb-[env(safe-area-inset-bottom)]">
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
				</footer>
			</div>
		</div>
	);
}
