"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { mergeOrganizationFieldsIntoUnsafeMetadata } from "@/app/lib/sign-up-org-metadata";

/** Серверээр байгууллагын бүртгэлийн өгөгдлийг `unsafeMetadata` руу хадгална. Утас, насыг энд бичихгүй. */
export async function saveSignUpProfileExtras(
  organizationAimag: string,
  organizationHot: string,
  organizationSum: string,
  organizationAddressDetail: string,
  organizationRegister: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const aimagT = organizationAimag.trim();
  const hotT = organizationHot.trim();
  const sumT = organizationSum.trim();
  const detailT = organizationAddressDetail.trim();
  const regT = organizationRegister.trim();

  if (!aimagT && !hotT && !sumT && !detailT && !regT) {
    return { ok: true };
  }

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });

  /** `setActive` дараах server action дуудалтад session cookie хоцорч `auth()` хоосон байж болно. */
  let userId: string | null = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const a = await auth();
    userId = a.userId;
    if (userId) break;
    await sleep(75 * (attempt + 1));
  }

  if (!userId) {
    return { ok: false, message: "Session not ready." };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = mergeOrganizationFieldsIntoUnsafeMetadata(
      user.unsafeMetadata as Record<string, unknown>,
      organizationAimag,
      organizationHot,
      organizationSum,
      organizationAddressDetail,
      organizationRegister,
    );

    await client.users.updateUser(userId, {
      unsafeMetadata: meta,
    });
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not save profile extras." };
  }
}
