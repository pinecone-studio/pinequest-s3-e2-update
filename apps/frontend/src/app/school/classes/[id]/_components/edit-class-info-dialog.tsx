"use client";

import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { updateClassInfo } from "@/app/school/action";

type TeacherOption = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

function teacherOptionLabel(t: TeacherOption): string {
  const l = t.lastName.trim();
  const f = t.firstName.trim();
  if (l && f) return `${l.charAt(0).toUpperCase()}.${f} (${t.email})`;
  return l || f || t.email;
}

type Props = {
  classId: string;
  initialGrade: number;
  initialSection: string;
  initialSectionTeacherId: string;
  teachers: TeacherOption[];
};

export function EditClassInfoDialog({
  classId,
  initialGrade,
  initialSection,
  initialSectionTeacherId,
  teachers,
}: Props) {
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState(String(initialGrade));
  const [section, setSection] = useState(initialSection.trim().toUpperCase().slice(0, 1));
  const [sectionTeacherId, setSectionTeacherId] = useState(initialSectionTeacherId);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setGrade(String(initialGrade));
          setSection(initialSection.trim().toUpperCase().slice(0, 1));
          setSectionTeacherId(initialSectionTeacherId);
          setFormError(null);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        title="Засах"
        aria-label="Ангийн мэдээлэл засах"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-zinc-900">Ангийн мэдээлэл засах</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Хаах"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="mt-5 space-y-4"
              action={async (formData) => {
                setFormError(null);
                setPending(true);
                try {
                  await updateClassInfo(formData);
                  setOpen(false);
                } catch (err) {
                  const msg =
                    err && typeof err === "object" && "message" in err
                      ? String((err as { message?: unknown }).message ?? "")
                      : "";
                  setFormError(msg || "Хадгалахад алдаа гарлаа. Дахин оролдоно уу.");
                } finally {
                  setPending(false);
                }
              }}
            >
              <input type="hidden" name="id" value={classId} />

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-zinc-500">Анги</span>
                  <input
                    name="grade"
                    required
                    inputMode="numeric"
                    maxLength={2}
                    value={grade}
                    onChange={(e) => {
                      const next = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setGrade(next);
                    }}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                    disabled={pending}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-zinc-500">Бүлэг</span>
                  <input
                    name="section"
                    required
                    maxLength={1}
                    value={section}
                    onChange={(e) => setSection(e.target.value.slice(0, 1).toUpperCase())}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm uppercase text-zinc-900"
                    disabled={pending}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-zinc-500">Анги даасан багш</span>
                <select
                  name="sectionTeacherId"
                  value={sectionTeacherId}
                  onChange={(e) => setSectionTeacherId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                  disabled={pending}
                  required
                >
                  <option value="">Сонгох…</option>
                  {initialSectionTeacherId.trim() &&
                  !teachers.some((t) => t.id === initialSectionTeacherId) ? (
                    <option value={initialSectionTeacherId}>
                      Одоогийн ID (жагсаалтад алга)
                    </option>
                  ) : null}
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {teacherOptionLabel(t)}
                    </option>
                  ))}
                </select>
              </label>

              {teachers.length === 0 ? (
                <p className="text-xs text-amber-700">
                  Эхлээд «Хүний нөөц» хуудаснаас багш нэмнэ үү.
                </p>
              ) : null}

              {formError ? (
                <p className="text-sm text-red-600" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  disabled={pending}
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={pending}
                >
                  {pending ? "Хадгалж байна…" : "Хадгалах"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
