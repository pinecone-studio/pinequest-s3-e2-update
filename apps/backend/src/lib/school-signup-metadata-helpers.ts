/** Same rules as frontend `hasAnyOrganizationSignupField` (sign-up-org-metadata). */
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
