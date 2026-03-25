"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

/** Серверээр байгууллагын бүртгэлийн өгөгдлийг `unsafeMetadata` руу хадгална. Утас, насыг энд бичихгүй. */
export async function saveSignUpProfileExtras(
  organizationAimag: string,
  organizationHot: string,
  organizationSum: string,
  organizationAddressDetail: string,
  organizationRegister: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "Session not ready." };
  }

  const aimagT = organizationAimag.trim();
  const hotT = organizationHot.trim();
  const sumT = organizationSum.trim();
  const detailT = organizationAddressDetail.trim();
  const regT = organizationRegister.trim();
  const combined = [aimagT, hotT, sumT].filter(Boolean).join(", ");
  const combinedWithDetail =
    combined && detailT
      ? `${combined} — ${detailT}`
      : combined || detailT;

  if (!aimagT && !hotT && !sumT && !detailT && !regT) {
    return { ok: true };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta: Record<string, unknown> = {
      ...(user.unsafeMetadata as Record<string, unknown>),
    };
    if (aimagT) meta.organizationAimag = aimagT;
    if (hotT) meta.organizationHot = hotT;
    if (sumT) meta.organizationSum = sumT;
    if (detailT) meta.organizationAddressDetail = detailT;
    if (combinedWithDetail) meta.organizationAddress = combinedWithDetail;
    if (regT) meta.organizationRegister = regT;

    await client.users.updateUser(userId, {
      unsafeMetadata: meta,
    });
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not save profile extras." };
  }
}
