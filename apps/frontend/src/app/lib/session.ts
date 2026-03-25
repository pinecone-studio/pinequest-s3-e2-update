import { cookies } from "next/headers";
import type { SessionPayload, User } from "./types";
import { store } from "./store";
const COOKIE = "school_session";

export async function getSessionUser(): Promise<User | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionPayload;
    if (!parsed?.userId) return null;
    return store.getUser(parsed.userId) ?? null;
  } catch {
    return null;
  }
}

export async function setSession(userId: string) {
  const jar = await cookies();
  const payload: SessionPayload = { userId };
  jar.set(COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
