export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-semibold text-[#183153]">{label}</span>
      ) : null}
      {children}
    </label>
  );
}
