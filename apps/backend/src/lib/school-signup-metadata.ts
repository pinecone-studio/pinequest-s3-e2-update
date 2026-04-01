/**
 * Mirrors `mergeOrganizationFieldsIntoUnsafeMetadata` (frontend) for D1 `school` row fields.
 */
export function combinedOrganizationAddress(
  organizationAimag: string,
  organizationHot: string,
  organizationSum: string,
  organizationAddressDetail: string,
): string {
  const aimagT = organizationAimag.trim();
  const hotT = organizationHot.trim();
  const sumT = organizationSum.trim();
  const detailT = organizationAddressDetail.trim();
  const combined = [aimagT, hotT, sumT].filter(Boolean).join(", ");
  const combinedWithDetail =
    combined && detailT
      ? `${combined} — ${detailT}`
      : combined || detailT;
  return combinedWithDetail;
}

/** `school.register` is integer; derive digits from org register string (e.g. УБ99112233). */
export function registerDigitsAsInt(organizationRegister: string): number {
  const digits = organizationRegister.replace(/\D/g, "");
  if (!digits) return 0;
  const n = Number.parseInt(digits.slice(0, 15), 10);
  return Number.isFinite(n) ? n : 0;
}

export type SchoolSignupInput = {
  email: string;
  organizationAimag: string;
  organizationHot: string;
  organizationSum: string;
  organizationAddressDetail: string;
  organizationRegister: string;
};

export function buildSchoolSignupRow(clerkUserId: string, input: SchoolSignupInput) {
  const email = input.email.trim();
  const address =
    combinedOrganizationAddress(
      input.organizationAimag,
      input.organizationHot,
      input.organizationSum,
      input.organizationAddressDetail,
    ) || "—";

  const regionLabel = [
    input.organizationAimag.trim(),
    input.organizationHot.trim(),
    input.organizationSum.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  const local = email.includes("@") ? email.split("@")[0]?.trim() ?? "" : email;
  const name =
    regionLabel ||
    (local.length > 0 ? local : `School ${clerkUserId.slice(-8)}`);

  return {
    email: email.length > 0 ? email : "unknown@local.invalid",
    name,
    address,
    register: registerDigitsAsInt(input.organizationRegister),
  };
}
