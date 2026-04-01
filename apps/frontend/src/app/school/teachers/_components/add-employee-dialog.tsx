"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { createTeacher } from "@/app/school/action";

const inputClass =
  "mt-1 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm";

const labelClass = "block min-w-0 text-xs font-medium text-zinc-600";

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false);

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
                  Овог, нэр, регистр, и-мэйл, албан тушаал, хичээлийг бөглөнө.
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
              action={async (formData) => {
                await createTeacher(formData);
                setOpen(false);
              }}
              className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <label className={labelClass}>
                Овог
                <input name="lastName" required placeholder="жишээ: Бат" className={inputClass} />
              </label>
              <label className={labelClass}>
                Нэр
                <input name="firstName" required placeholder="жишээ: Сарнай" className={inputClass} />
              </label>
              <label className={labelClass}>
                Регистр
                <input name="registerNumber" required placeholder="жишээ: УБ99112233" className={inputClass} />
              </label>
              <label className={labelClass}>
                И-мэйл
                <input name="email" type="email" placeholder="ner@sur.mn" className={inputClass} />
              </label>
              <label className={labelClass}>
                Албан тушаал
                <input name="position" placeholder="жишээ: Багш" className={inputClass} />
              </label>
              <label className={labelClass}>
                Хичээл
                <input name="specialty" placeholder="жишээ: Математик" className={inputClass} />
              </label>

              <div className="flex items-end justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Нэмэх
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
