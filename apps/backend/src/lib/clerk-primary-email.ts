import { createClerkClient } from "@clerk/backend";
import type { Env } from "../types";

/** Clerk Backend API: нэвтэрсэн хэрэглэгчийн үндсэн и-мэйл. */
export async function clerkPrimaryEmail(
  clerkUserId: string,
  env: Env,
): Promise<string | null> {
  const secret = env.CLERK_SECRET_KEY?.trim();
  if (!secret) {
    console.error("[clerk-primary-email] Missing CLERK_SECRET_KEY");
    return null;
  }

  try {
    const clerk = createClerkClient({ secretKey: secret });
    const user = await clerk.users.getUser(clerkUserId);
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId,
    );
    const raw =
      primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "";
    const email = raw.trim();
    return email.length > 0 ? email : null;
  } catch (e) {
    console.error("[clerk-primary-email] getUser failed:", e);
    return null;
  }
}
