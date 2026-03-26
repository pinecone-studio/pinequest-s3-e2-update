import type { TeacherClass } from "../types";

export function ClassPicker({
  classes,
  selectedClassId,
  onSelect,
}: {
  classes: TeacherClass[];
  selectedClassId: string;
  onSelect: (classId: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {classes.map((item) => {
        const isActive = selectedClassId === item.id;
        return (
          <button
            className={
              "rounded-xl border px-3 py-2 text-left " +
              (isActive
                ? "border-[#4f9dff] bg-[#eef6ff]"
                : "border-[#d9e6fb] bg-white hover:border-[#bcd6f8]")
            }
            key={item.id}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            <p className="text-4 font-bold text-[#1f2a44]">{item.name}</p>
            <p className="text-2 text-[#5c6f91]">
              {item.grade} · {item.studentCount} сурагч
            </p>
          </button>
        );
      })}
    </div>
  );
}
