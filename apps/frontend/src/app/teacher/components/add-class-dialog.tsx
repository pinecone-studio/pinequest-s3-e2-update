"use client";

import { useState } from "react";
import { X } from "lucide-react";

export type AddClassFormData = {
  name: string;
  subject: string;
};

type AddClassDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AddClassFormData) => void;
};

export default function AddClassDialog({ open, onClose, onSubmit }: AddClassDialogProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) return;
    onSubmit?.({ name: name.trim(), subject: subject.trim() });
    setName("");
    setSubject("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setSubject("");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-class-title"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="add-class-title" className="text-xl font-extrabold text-[#1f2a44]">
            Анги нэмэх
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#1f2a44]"
            type="button"
            aria-label="Хаах"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="class-name" className="mb-1.5 block text-4 font-semibold text-[#334261]">
              Ангийн нэр
            </label>
            <input
              id="class-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Жишээ: 10А, 9Б"
              className="w-full rounded-xl border border-[#d9dee8] px-4 py-3 text-4 text-[#1f2a44] outline-none transition placeholder:text-[#94a3b8] focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              required
            />
          </div>

          <div>
            <label htmlFor="class-subject" className="mb-1.5 block text-4 font-semibold text-[#334261]">
              Хичээл
            </label>
            <input
              id="class-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Жишээ: Нийгэм, Математик"
              className="w-full rounded-xl border border-[#d9dee8] px-4 py-3 text-4 text-[#1f2a44] outline-none transition placeholder:text-[#94a3b8] focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-[#d9dee8] bg-white py-3 text-4 font-semibold text-[#334261] transition hover:bg-[#f8fafc]"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-teal-600 py-3 text-4 font-semibold text-white transition hover:bg-teal-700"
            >
              Нэмэх
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
