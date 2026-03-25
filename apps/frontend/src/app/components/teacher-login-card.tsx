import Link from "next/link";
import { loginTeacherInstant } from "@/app/auth/actions";

type Props = {
  error?: string;
};

export function TeacherLoginCard({ error }: Props) {
  return (
    <div className="rounded-2xl border border-[#d9dee8] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <p className="text-5 font-extrabold text-[#1f2a44]">Орчин сонгох</p>
        <p className="mt-1 text-3 leading-snug text-[#5b6883]">
          Багшийн хэсэгт шууд нэвтрэх эсвэл захиргаа руу шилжинэ.
        </p>
      </div>

      {error === "login" ? (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2.5 text-3 text-red-700">
          Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.
        </p>
      ) : null}
      {error === "auth" ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2.5 text-3 text-amber-900">
          Багшийн хэсэгт орохын тулд эхлээд нэвтэрнэ үү.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        <Link
          href="/admin"
          className="flex min-h-[3.25rem] flex-1 items-center justify-center rounded-2xl border border-[#d9dee8] bg-[#f8fafc] px-4 py-3 text-center text-4 font-semibold text-[#2f3c59] shadow-sm transition hover:border-teal-300 hover:bg-teal-50 sm:min-h-[3.5rem] sm:text-5"
        >
          Захиргааны хэсэг
        </Link>
        <form
          action={loginTeacherInstant}
          className="flex min-h-[3.25rem] flex-1 flex-col sm:min-h-[3.5rem]"
        >
          <button
            type="submit"
            className="h-full min-h-[3.25rem] w-full flex-1 rounded-2xl bg-teal-600 px-4 py-3 text-4 font-semibold text-white shadow-md transition hover:bg-teal-700 sm:min-h-[3.5rem] sm:text-5"
          >
            Багшийн хэсэгт нэвтрэх
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-3 text-[#6b7894]">
        Student орчин удахгүй нээгдэнэ.
      </p>
    </div>
  );
}
