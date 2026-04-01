"use client";

import { useMutation } from "@apollo/client/react";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { ADD_TEACHER } from "@/graphql/typeDefs/mutations";
import { GET_TEACHERS_BY_SCHOOL_ID } from "@/graphql/typeDefs/queries";

const inputClass =
  "mt-1 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm";

const labelClass = "block min-w-0 text-xs font-medium text-zinc-600";

type AddTeacherResponse = {
  addTeacher: { id: string };
};

export function AddEmployeeDialog({
  schoolId,
  onTeacherAdded,
}: {
  schoolId: string;
  onTeacherAdded?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [addTeacher, { loading }] = useMutation<AddTeacherResponse>(ADD_TEACHER, {
    refetchQueries: [{ query: GET_TEACHERS_BY_SCHOOL_ID, variables: { schoolId } }],
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
      >
        <Plus className="h-4 w-4" />
        Ажилтан нэмэх
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Ажилтан нэмэх</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Овог, нэр, и-мэйл, албан тушаалыг бөглөнө. Дараа нь багшдыг ижил и-мэйлээр Clerk-д бүртгүүлж, багшийн хэсэгт
                  нэвтрүүлбэл бүртгэл автоматаар холбогдоно.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitError(null);
                  setOpen(false);
                }}
                className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Хаах"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitError ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {submitError}
              </p>
            ) : null}

            <form
              className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitError(null);
                const form = e.currentTarget;
                const firstName = String(
                  (form.elements.namedItem("firstName") as HTMLInputElement).value ?? "",
                ).trim();
                const lastName = String(
                  (form.elements.namedItem("lastName") as HTMLInputElement).value ?? "",
                ).trim();
                const email = String(
                  (form.elements.namedItem("email") as HTMLInputElement).value ?? "",
                ).trim();
                const roleRaw = String(
                  (form.elements.namedItem("position") as HTMLInputElement).value ?? "",
                ).trim();
                if (!firstName || !lastName || !email) {
                  setSubmitError("Овог, нэр, и-мэйл заавал бөглөнө.");
                  return;
                }
                try {
                  await addTeacher({
                    variables: {
                      input: {
                        schoolId,
                        firstName,
                        lastName,
                        email,
                        role: roleRaw || "Багш",
                        classIds: [],
                      },
                    },
                  });
                  form.reset();
                  setOpen(false);
                  onTeacherAdded?.();
                } catch {
                  setSubmitError("Хадгалахад алдаа гарлаа. Дахин оролдоно уу.");
                }
              }}
            >
              <label className={labelClass}>
                Овог
                <input name="lastName" required placeholder="жишээ: Бат" className={inputClass} />
              </label>
              <label className={labelClass}>
                Нэр
                <input name="firstName" required placeholder="жишээ: Сарнай" className={inputClass} />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                И-мэйл
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="ner@sur.mn"
                  className={inputClass}
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Албан тушаал
                <input name="position" placeholder="жишээ: Багш" className={inputClass} />
              </label>

              <div className="flex items-end justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitError(null);
                    setOpen(false);
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  disabled={loading}
                >
                  Болих
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Хадгалж байна…" : "Нэмэх"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
