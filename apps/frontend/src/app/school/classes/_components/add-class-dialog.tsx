"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { createClass } from "@/app/school/action";

export function AddClassDialog() {
  const [open, setOpen] = useState(false);

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
                  Жишээ: 10А, 10Б, 12c
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
                await createClass(formData);
                setOpen(false);
              }}
              className="mt-5 space-y-4"
            >
              <label className="block">
                <span className="text-xs font-medium text-zinc-500">Ангийн/бүлгийн нэр</span>
                <input
                  name="name"
                  required
                  placeholder="жишээ: 10А"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                />
              </label>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
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
