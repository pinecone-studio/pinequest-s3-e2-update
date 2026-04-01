import type { WebhookEvent } from "@clerk/backend/webhooks";
import { hasAnyOrganizationSignupField } from "./school-signup-metadata-helpers";
import type { SchoolSignupInput } from "./school-signup-metadata";

type UserWebhookData = Extract<
  WebhookEvent,
  { type: "user.created" | "user.updated" }
>["data"];

function metaString(
  meta: Record<string, unknown>,
  camel: string,
  snake: string,
): string {
  for (const key of [camel, snake]) {
    const v = meta[key];
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
  }
  return "";
}

function primaryEmail(user: UserWebhookData): string {
  const list = user.email_addresses ?? [];
  const primary = list.find((e) => e.id === user.primary_email_address_id);
  const email = primary?.email_address ?? list[0]?.email_address;
  return (email ?? "").trim();
}

/**
 * Builds school signup input from Clerk `user.*` webhook JSON.
 * Returns null when org fields are absent (same idea as skipping teacher-only profiles).
 */
export function schoolSignupInputFromUserJson(
  user: UserWebhookData,
): SchoolSignupInput | null {
  const raw = user.unsafe_metadata;
  const meta =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const organizationAimag = metaString(meta, "organizationAimag", "organization_aimag");
  const organizationHot = metaString(meta, "organizationHot", "organization_hot");
  const organizationSum = metaString(meta, "organizationSum", "organization_sum");
  const organizationAddressDetail = metaString(
    meta,
    "organizationAddressDetail",
    "organization_address_detail",
  );
  const organizationRegister = metaString(
    meta,
    "organizationRegister",
    "organization_register",
  );
  /** Set by `mergeOrganizationFieldsIntoUnsafeMetadata` when region parts are filled. */
  const organizationAddress = metaString(
    meta,
    "organizationAddress",
    "organization_address",
  );

  const addressDetailEffective = organizationAddressDetail.trim()
    ? organizationAddressDetail
    : organizationAddress;

  const hasOrg =
    hasAnyOrganizationSignupField(
      organizationAimag,
      organizationHot,
      organizationSum,
      addressDetailEffective,
      organizationRegister,
    ) || Boolean(organizationAddress.trim());

  if (!hasOrg) {
    return null;
  }

  const email = primaryEmail(user);
  if (!email) return null;

  return {
    email,
    organizationAimag,
    organizationHot,
    organizationSum,
    organizationAddressDetail: addressDetailEffective,
    organizationRegister,
  };
}
