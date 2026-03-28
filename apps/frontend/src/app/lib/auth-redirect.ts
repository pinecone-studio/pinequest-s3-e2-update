/**
 * Нэвтрэлт / бүртгэлийн дараах шилжилт — query (`redirect_url`) → зөвшөөрөгдсөн дотоод зам,
 * дараа нь `window.location.replace` (client) эсвэл `<Link href=…>`.
 */

/** `/sign-in`, `/sign-up` дээрх query нэр (Clerk-тай нийцүүлсэн) */
export const LOGIN_INTENT_QUERY_KEY = "redirect_url" as const;

export const AUTH_ROUTES = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  ssoCallback: "/sso-callback",
} as const;

function trimTrailingSlash(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

/**
 * Query-аас уншсан утгыг аюулгүй дотоод path болгоно (open redirect хориглоно).
 * Зөвшөөрөгдсөн самбар: `/`, `/teacher`, `/school` (бусад → `/`).
 */
export function safeAuthRedirect(
  raw: string | string[] | null | undefined,
): string {
  const v0 = Array.isArray(raw) ? raw[0] : raw;
  if (v0 == null || typeof v0 !== "string") return "/";
  let v = v0.trim();
  if (!v) return "/";
  try {
    if (v.includes("%")) v = decodeURIComponent(v);
  } catch {
    return "/";
  }
  v = trimTrailingSlash(v.trim());
  if (v.includes("://") || v.startsWith("//")) return "/";
  if (!v.startsWith("/")) v = `/${v}`;
  v = trimTrailingSlash(v);
  if (v === "/teacher" || v === "/school") return v;
  return "/";
}

/**
 * Session бэлэн болсны дараа очих pathname.
 * - Query-д `/teacher` | `/school` өгсөн бол түүнийг;
 * - Үгүй бол Clerk `publicMetadata.role`;
 * - Default: `/teacher`.
 */
export function resolvePostAuthDashboard(
  queryIntent: string,
  clerkPublicMetadataRole: unknown,
): string {
  if (queryIntent === "/teacher" || queryIntent === "/school") {
    return queryIntent;
  }
  if (clerkPublicMetadataRole === "teacher") return "/teacher";
  if (
    clerkPublicMetadataRole === "school_admin" ||
    clerkPublicMetadataRole === "admin"
  ) {
    return "/school";
  }
  return "/teacher";
}

/**
 * OAuth эхлүүлэх үед session байхгүй тул role таньж чадахгүй — зөвхөн query intent ашиглана.
 */
export function oauthPostAuthRedirectUrl(queryIntent: string): string {
  return resolvePostAuthDashboard(queryIntent, undefined);
}

function intentForAuthHref(redirectTarget: string): string {
  return safeAuthRedirect(redirectTarget);
}

/** Жишээ: `authSignInHref(\"/school\")` → `/sign-in?redirect_url=%2Fadmin` */
export function authSignInHref(redirectTarget: string): string {
  const intent = intentForAuthHref(redirectTarget);
  return `${AUTH_ROUTES.signIn}?${LOGIN_INTENT_QUERY_KEY}=${encodeURIComponent(intent)}`;
}

export function authSignUpHref(redirectTarget: string): string {
  const intent = intentForAuthHref(redirectTarget);
  return `${AUTH_ROUTES.signUp}?${LOGIN_INTENT_QUERY_KEY}=${encodeURIComponent(intent)}`;
}

export function authSsoCallbackFullUrl(origin: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${AUTH_ROUTES.ssoCallback}`;
}

/** OAuth `redirectUrl` зэрэгт: pathname-ийг тухайн origin дээр бүрэн URL болгоно. */
export function absoluteAppUrlForPath(origin: string, pathname: string): string {
  const base = origin.replace(/\/$/, "");
  return new URL(pathname, `${base}/`).href;
}

/** Client: бүх гараар нэвтрэлтийн дараа ижил origin дээр бүрэн ачаалалт. */
export function hardNavigateToAppPath(pathname: string): void {
  if (typeof window === "undefined") return;
  window.location.replace(new URL(pathname, window.location.origin).href);
}
