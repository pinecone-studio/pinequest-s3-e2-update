import type { WebhookEvent } from "@clerk/backend/webhooks";
import { hasAnyOrganizationSignupField } from "./school-signup-metadata-helpers";
import {
  combinedOrganizationAddress,
  normSpaceCase,
  schoolNameExcludingLocationRedundant,
  type SchoolSignupInput,
} from "./school-signup-metadata";

type UserWebhookData = Extract<
  WebhookEvent,
  { type: "user.created" | "user.updated" }
>["data"];

/** Clerk may expose `unsafe_metadata` (webhook JSON) and/or `unsafeMetadata` (some SDK shapes). */
function unsafeMetadataFromUser(user: UserWebhookData): Record<string, unknown> {
  const u = user as Record<string, unknown>;
  const asObj = (v: unknown): Record<string, unknown> =>
    v !== null && typeof v === "object" && !Array.isArray(v)
      ? (v as Record<string, unknown>)
      : {};
  return { ...asObj(u.unsafe_metadata), ...asObj(u.unsafeMetadata) };
}

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

function organizationDisplayNameFromMeta(meta: Record<string, unknown>): string {
  const orgAddr = metaString(meta, "organizationAddress", "organization_address").trim();
  const aimag = metaString(meta, "organizationAimag", "organization_aimag").trim();
  const hot = metaString(meta, "organizationHot", "organization_hot").trim();
  const sum = metaString(meta, "organizationSum", "organization_sum").trim();
  const detail = metaString(
    meta,
    "organizationAddressDetail",
    "organization_address_detail",
  ).trim();
  const combinedLine = combinedOrganizationAddress(aimag, hot, sum, detail).trim();

  const looksLikeLocationOnly = (s: string): boolean => {
    const n = normSpaceCase(s);
    if (!n) return false;
    if (orgAddr && n === normSpaceCase(orgAddr)) return true;
    if (combinedLine && n === normSpaceCase(combinedLine)) return true;
    const regionOnly = [aimag, hot, sum].filter(Boolean).join(", ");
    if (regionOnly && n === normSpaceCase(regionOnly)) return true;
    return false;
  };

  const fromCanonical = metaString(
    meta,
    "organizationSchoolName",
    "organization_school_name",
  ).trim();
  if (fromCanonical && !looksLikeLocationOnly(fromCanonical)) {
    return fromCanonical;
  }
  const fromName = metaString(meta, "name", "name").trim();
  if (fromName && !looksLikeLocationOnly(fromName)) return fromName;
  const legacy = metaString(meta, "schoolName", "school_name").trim();
  if (legacy && !looksLikeLocationOnly(legacy)) return legacy;
  return "";
}

export function schoolSignupInputFromUserJson(
  user: UserWebhookData,
): SchoolSignupInput | null {
  const meta = unsafeMetadataFromUser(user);

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
  const nameRaw = organizationDisplayNameFromMeta(meta);
  const organizationAddress = metaString(
    meta,
    "organizationAddress",
    "organization_address",
  );

  const addressDetailEffective = organizationAddressDetail.trim()
    ? organizationAddressDetail
    : organizationAddress;

  const hasOrgCore =
    Boolean(organizationAimag.trim()) ||
    Boolean(organizationHot.trim()) ||
    Boolean(organizationSum.trim()) ||
    Boolean(organizationAddressDetail.trim()) ||
    Boolean(organizationRegister.trim()) ||
    Boolean(organizationAddress.trim());

  const hasOrg =
    hasAnyOrganizationSignupField(
      organizationAimag,
      organizationHot,
      organizationSum,
      addressDetailEffective,
      organizationRegister,
      nameRaw,
    ) || Boolean(organizationAddress.trim());

  /** Avoid upserting a school row from metadata `name` alone when org/address keys are missing (partial webhook). */
  if (!hasOrg || !hasOrgCore) {
    return null;
  }

  const email = primaryEmail(user);
  if (!email) return null;

  const fromDivisions = combinedOrganizationAddress(
    organizationAimag,
    organizationHot,
    organizationSum,
    organizationAddressDetail,
  ).trim();
  const resolvedLocationLine = (fromDivisions || organizationAddress.trim()).trim();
  const name = schoolNameExcludingLocationRedundant(
    nameRaw,
    organizationAimag,
    organizationHot,
    organizationSum,
    organizationAddressDetail,
    organizationAddress,
    resolvedLocationLine || undefined,
  );

  return {
    email,
    name,
    organizationAimag,
    organizationHot,
    organizationSum,
    organizationAddressDetail: organizationAddressDetail,
    organizationAddressMeta: organizationAddress,
    organizationRegister,
  };
}
