export function NavigatorLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-2 font-semibold text-[#5f7090]">
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
        Одоогийн
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
        Хариулсан
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
        Тэмдэглэсэн
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
        Хариулаагүй
      </span>
    </div>
  );
}
