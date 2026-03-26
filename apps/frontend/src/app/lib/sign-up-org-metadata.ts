/**
 * Байгууллагын бүртгэлийн талбаруудыг Clerk `unsafeMetadata` объектод нэгтгэнэ.
 * (Сервер болон клиент хоёуланд ашиглана.)
 */
export function mergeOrganizationFieldsIntoUnsafeMetadata(
  existing: Record<string, unknown> | null | undefined,
  organizationAimag: string,
  organizationHot: string,
  organizationSum: string,
  organizationAddressDetail: string,
  organizationRegister: string,
): Record<string, unknown> {
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

  const meta: Record<string, unknown> = { ...(existing ?? {}) };
  if (aimagT) meta.organizationAimag = aimagT;
  if (hotT) meta.organizationHot = hotT;
  if (sumT) meta.organizationSum = sumT;
  if (detailT) meta.organizationAddressDetail = detailT;
  if (combinedWithDetail) meta.organizationAddress = combinedWithDetail;
  if (regT) meta.organizationRegister = regT;
  return meta;
}

export function hasAnyOrganizationSignupField(
  organizationAimag: string,
  organizationHot: string,
  organizationSum: string,
  organizationAddressDetail: string,
  organizationRegister: string,
): boolean {
  return Boolean(
    organizationAimag.trim() ||
      organizationHot.trim() ||
      organizationSum.trim() ||
      organizationAddressDetail.trim() ||
      organizationRegister.trim(),
  );
}
