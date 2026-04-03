"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { CREATE_CLASS } from "@/graphql/typeDefs/mutations";
import { GET_CLASS_BY_SCHOOL_ID, GET_TEACHERS_BY_SCHOOL_ID } from "@/graphql/typeDefs/queries";

type TeacherOption = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type TeachersQuery = {
  getTeachersBySchoolId: TeacherOption[];
};

export function AddClassDialog({ schoolId }: { schoolId: string }) {
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [sectionTeacherId, setSectionTeacherId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { data: teachersData, loading: teachersLoading } = useQuery<TeachersQuery>(
    GET_TEACHERS_BY_SCHOOL_ID,
    {
      variables: { schoolId },
      skip: !schoolId || !open,
      fetchPolicy: "cache-and-network",
    },
  );

  const [createClass, { loading }] = useMutation(CREATE_CLASS, {
    refetchQueries: [{ query: GET_CLASS_BY_SCHOOL_ID, variables: { schoolId } }],
    awaitRefetchQueries: true,
  });

  const normalizedSection = section.trim().toUpperCase();
  const combinedName = `${grade.trim()}${normalizedSection}`.trim();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
      >
        <Plus className="h-4 w-4" />
        Анги нэмэх
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Анги / Бүлэг нэмэх</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Жишээ: Анги 10, Бүлэг А
                </p>
              </div>
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
              onSubmit={async (e) => {
                e.preventDefault();
                setFormError(null);
                const g = Number.parseInt(grade.trim(), 10);
                if (!Number.isFinite(g) || g <= 0) {
                  setFormError("Анги (тоо) зөв оруулна уу.");
                  return;
                }
                const sec = normalizedSection;
                if (!sec) {
                  setFormError("Бүлэг (үсэг) оруулна уу.");
                  return;
                }
                const homeroomId = sectionTeacherId.trim();
                if (!homeroomId) {
                  setFormError("Анги даасан багш сонгоно уу.");
                  return;
                }
                if (!schoolId) {
                  setFormError("Сургуулийн мэдээлэл олдсонгүй. Дахин ачаална уу.");
                  return;
                }
                try {
                  await createClass({
                    variables: {
                      input: {
                        schoolId,
                        grade: g,
                        section: sec,
                        sectionTeacherId: homeroomId,
                      },
                    },
                  });
                  setGrade("");
                  setSection("");
                  setSectionTeacherId("");
                  setOpen(false);
                } catch (err) {
                  const msg =
                    err && typeof err === "object" && "message" in err
                      ? String((err as { message?: unknown }).message ?? "")
                      : "";
                  setFormError(msg || "Анги нэмэхэд алдаа гарлаа. Дахин оролдоно уу.");
                }
              }}
              className="mt-5 space-y-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-zinc-500">Анги</span>
                  <input
                    name="grade"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{1,2}"
                    maxLength={2}
                    value={grade}
                    onChange={(e) => {
                      const next = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setGrade(next);
                    }}
                    placeholder="жишээ: 10"
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                    disabled={loading}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-zinc-500">Бүлэг</span>
                  <input
                    name="section"
                    required
                    maxLength={1}
                    value={section}
                    onChange={(e) => setSection(e.target.value.slice(0, 1))}
                    placeholder="жишээ: А"
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm uppercase text-zinc-900"
                    disabled={loading}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-zinc-500">
                  Анги даасан багш
                </span>
                <select
                  name="sectionTeacherId"
                  value={sectionTeacherId}
                  onChange={(e) => setSectionTeacherId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                  disabled={loading || teachersLoading}
                  required
                >
                  <option value="">
                    {teachersLoading ? "Ачаалж байна…" : "Сонгох…"}
                  </option>
                  {(teachersData?.getTeachersBySchoolId ?? []).map((t) => {
                    const l = t.lastName.trim();
                    const f = t.firstName.trim();
                    const label =
                      l && f
                        ? `${l.charAt(0).toUpperCase()}.${f} (${t.email})`
                        : `${l || f || t.email}`;
                    return (
                      <option key={t.id} value={t.id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
                {!teachersLoading &&
                (teachersData?.getTeachersBySchoolId?.length ?? 0) === 0 ? (
                  <p className="mt-1 text-xs text-amber-700">
                    Эхлээд «Хүний нөөц» хуудаснаас багш нэмнэ үү.
                  </p>
                ) : null}
              </label>

              <input type="hidden" name="name" value={combinedName} />

              {formError ? (
                <p className="text-sm text-red-600" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  disabled={loading}
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                  {loading ? "Нэмж байна…" : "Нэмэх"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
