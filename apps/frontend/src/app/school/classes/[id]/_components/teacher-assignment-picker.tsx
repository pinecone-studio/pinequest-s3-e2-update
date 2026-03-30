"use client";

import { Pencil, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type TeacherOption = {
  id: string;
  name: string;
  email: string;
  specialty?: string;
};

export function TeacherAssignmentPicker({
  teachers,
  initialSelectedIds,
}: {
  teachers: TeacherOption[];
  initialSelectedIds: string[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoSubmitRef = useRef(false);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedTeachers = useMemo(
    () => teachers.filter((t) => selectedSet.has(t.id)),
    [teachers, selectedSet],
  );
  const filteredTeachers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => {
      const full = `${t.name} ${t.email} ${t.specialty ?? ""}`.toLowerCase();
      return full.includes(q);
    });
  }, [teachers, query]);

  const toggleTeacher = (teacherId: string) => {
    shouldAutoSubmitRef.current = true;
    setSelectedIds((prev) => {
      if (prev.includes(teacherId)) return prev.filter((id) => id !== teacherId);
      return [...prev, teacherId];
    });
  };

  useEffect(() => {
    if (!shouldAutoSubmitRef.current) return;
    shouldAutoSubmitRef.current = false;
    const form = rootRef.current?.closest("form");
    form?.requestSubmit();
  }, [selectedIds]);

  return (
    <div ref={rootRef} className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-zinc-500">
          Багш нэмж хасаж болно. Сонголт автоматаар хадгалагдана.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsEditing((v) => !v);
            setOpen(true);
          }}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          title="Багшийн хуваарилалт засах"
          aria-label="Багшийн хуваарилалт засах"
        >
          <Pencil className="h-3.5 w-3.5" />
          Засах
        </button>
      </div>

      {selectedTeachers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedTeachers.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
            >
              {t.name}
              {(isEditing || open) && (
                <button
                  type="button"
                  onClick={() => toggleTeacher(t.id)}
                  className="rounded-full p-0.5 text-blue-700 hover:bg-blue-100"
                  aria-label={`${t.name} устгах`}
                  title={`${t.name} устгах`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Одоогоор багш сонгоогүй байна.</p>
      )}

      <div ref={boxRef} className="relative">
        <div
          className="flex min-h-11 cursor-text items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Багш сонгох..."
            className="w-full border-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
        </div>

        {open && (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
            {filteredTeachers.length === 0 ? (
              <p className="px-3 py-2 text-sm text-zinc-500">Илэрц олдсонгүй.</p>
            ) : (
              filteredTeachers.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 hover:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedSet.has(t.id)}
                    onChange={() => toggleTeacher(t.id)}
                    className="mt-1 size-4 rounded border-zinc-300"
                  />
                  <span className="min-w-0 text-sm">
                    <span className="font-medium text-zinc-900">{t.name}</span>
                    {t.specialty?.trim() ? (
                      <span className="ml-1 text-blue-700">({t.specialty})</span>
                    ) : null}
                    <span className="ml-2 text-zinc-500">{t.email}</span>
                  </span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="teacherIds" value={id} />
      ))}
    </div>
  );
}
