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

export function normSpaceCase(s: string): string {
  return s
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[—–−]/g, "-")
    .toLowerCase();
}

/** `school.register` is integer; derive digits from org register string (e.g. УБ99112233). */
export function registerDigitsAsInt(organizationRegister: string): number {
  const digits = organizationRegister.replace(/\D/g, "");
  if (!digits) return 0;
  const n = Number.parseInt(digits.slice(0, 15), 10);
  return Number.isFinite(n) ? n : 0;
}

/** D1 `school.provinceOrCity`: аймаг + хот (form) */
export function provinceOrCityFromSignupDivisions(
  organizationAimag: string,
  organizationHot: string,
): string {
  const parts = [organizationAimag.trim(), organizationHot.trim()].filter(Boolean);
  return parts.join(", ") || "—";
}

/** D1 `school.soumOrDistrict`: сум / дүүрэг (form) */
export function soumOrDistrictFromSignup(organizationSum: string): string {
  return organizationSum.trim() || "—";
}

export type SchoolSignupInput = {
  email: string;
  name: string;
  organizationAimag: string;
  organizationHot: string;
  organizationSum: string;
  organizationAddressDetail: string;
  organizationRegister: string;
  organizationAddressMeta: string;
};

export function schoolNameExcludingLocationRedundant(
  schoolNameRaw: string,
  organizationAimag: string,
  organizationHot: string,
  organizationSum: string,
  organizationAddressDetail: string,
  organizationAddressMeta: string,
  fullResolvedAddress?: string,
): string {
  const t = schoolNameRaw.trim();
  if (!t) return "";

  const regionLabel = [
    organizationAimag.trim(),
    organizationHot.trim(),
    organizationSum.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  const lineFromFields =
    combinedOrganizationAddress(
      organizationAimag,
      organizationHot,
      organizationSum,
      organizationAddressDetail,
    ).trim() || "";

  const orgAddr = organizationAddressMeta.trim();
  const resolved = fullResolvedAddress?.trim() ?? "";

  const tn = normSpaceCase(t);
  if (!tn) return "";

  if (
    (orgAddr && tn === normSpaceCase(orgAddr)) ||
    (regionLabel && tn === normSpaceCase(regionLabel))
  ) {
    return "";
  }
  if (lineFromFields && tn === normSpaceCase(lineFromFields)) return "";
  if (resolved && resolved !== "—" && tn === normSpaceCase(resolved)) return "";

  return t;
}

export function buildSchoolSignupRow(clerkUserId: string, input: SchoolSignupInput) {
  const email = input.email.trim();
  const fromDivisions = combinedOrganizationAddress(
    input.organizationAimag,
    input.organizationHot,
    input.organizationSum,
    input.organizationAddressDetail,
  ).trim();
  const metaLine = input.organizationAddressMeta.trim();
  const fullLocationLine = (fromDivisions || metaLine).trim();

  /** D1 `address`: зөвхөн дэлгэрэнгүй хаяг (organizationAddressDetail). */
  const address = input.organizationAddressDetail.trim() || "—";

  const local = email.includes("@") ? email.split("@")[0]?.trim() ?? "" : email;
  const schoolNameT = schoolNameExcludingLocationRedundant(
    input.name,
    input.organizationAimag,
    input.organizationHot,
    input.organizationSum,
    input.organizationAddressDetail,
    metaLine,
    fullLocationLine || undefined,
  );
  const regionLabel = [
    input.organizationAimag.trim(),
    input.organizationHot.trim(),
    input.organizationSum.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  let rowName =
    schoolNameT ||
    (local.length > 0 ? local : `School ${clerkUserId.slice(-8)}`);

  const addrNorm = address === "—" ? "" : address;
  const rn = normSpaceCase(rowName);
  if (
    (addrNorm && rn === normSpaceCase(addrNorm)) ||
    (regionLabel && rn === normSpaceCase(regionLabel)) ||
    (fromDivisions && rn === normSpaceCase(fromDivisions)) ||
    (metaLine && rn === normSpaceCase(metaLine))
  ) {
    rowName =
      local.length > 0 ? local : `School ${clerkUserId.slice(-8)}`;
  }

  return {
    email: email.length > 0 ? email : "unknown@local.invalid",
    name: rowName,
    address,
    register: registerDigitsAsInt(input.organizationRegister),
    provinceOrCity: provinceOrCityFromSignupDivisions(
      input.organizationAimag,
      input.organizationHot,
    ),
    soumOrDistrict: soumOrDistrictFromSignup(input.organizationSum),
  };
}
