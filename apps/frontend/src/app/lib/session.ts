import { auth } from "@clerk/nextjs/server";
import {
  getAppUserFromClerk,
  getAppUserFromUserId,
} from "@/app/lib/clerk-app-user";
import type { User } from "@/app/lib/types";

/** Одоогийн session-оос school_admin хэрэглэгч (`admin/layout`-тай ижил). */
export async function getSessionUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await getAppUserFromClerk("school_admin");
  if (!user) {
    user = await getAppUserFromUserId(userId, "school_admin");
  }
  return user;
}
