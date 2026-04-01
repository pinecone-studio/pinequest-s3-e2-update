import { verifyToken } from "@clerk/backend";
import type { Env } from "../types";

function bearerToken(request: Request): string | null {
  const raw = request.headers.get("authorization");
  if (!raw?.toLowerCase().startsWith("bearer ")) return null;
  const value = raw.slice(7).trim();
  return value.length > 0 ? value : null;
}

/**
 * Resolves the Clerk user id (`sub`) from `Authorization: Bearer <session_jwt>`.
 * Returns null when there is no token, no secret/jwtKey, or verification fails.
 */
export async function clerkUserIdFromRequest(
  request: Request,
  env: Env,
): Promise<string | null> {
  const secretKey = env.CLERK_SECRET_KEY?.trim();
  const jwtKey = env.CLERK_JWT_KEY?.trim();
  if (!jwtKey && !secretKey) return null;

  const token = bearerToken(request);
  if (!token) return null;

  try {
    const payload = await verifyToken(token, {
      ...(jwtKey ? { jwtKey } : { secretKey: secretKey! }),
    });
    const sub = payload.sub;
    return typeof sub === "string" && sub.length > 0 ? sub : null;
  } catch (err) {
    console.error("[clerk-bearer] verifyToken failed:", err);
    return null;
  }
}
