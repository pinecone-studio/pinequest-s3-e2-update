/**
 * `@clerk/nextjs` Future resource төрөлд `reload` тусгагдаагүй нь элэг үүсгэдэг;
 * runtime-д зарим нөхцөлд `createdSessionId` авахад дахин ачаалах шаардлагатай.
 */
export async function clerkTryReloadSessionResource(
  resource: unknown,
): Promise<void> {
  const r = resource as { reload?: () => Promise<unknown> };
  if (typeof r.reload === "function") {
    await r.reload();
  }
}
