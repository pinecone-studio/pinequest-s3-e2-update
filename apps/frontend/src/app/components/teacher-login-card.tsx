import Link from "next/link";
import { authSignInHref, authSignUpHref } from "@/app/lib/auth-redirect";

type Props = {
  error?: string;
};

export function TeacherLoginCard({ error }: Props) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">
          Нэвтрэх хэсэг
        </p>
        <p className="mt-2 text-2xl font-extrabold text-[#183153]">
          Өөрийн орчноо сонгоод үргэлжлүүлнэ үү
        </p>
        <p className="mt-2 text-sm leading-6 text-[#5b6883] sm:text-base">
          UPDATE-ийн exam module-д сургууль болон багшийн эрхээр шууд нэвтрэх
          боломжтой.
        </p>
      </div>

      {error === "login" ? (
        <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.
        </p>
      ) : null}
      {error === "auth" ? (
        <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Багшийн хэсэгт орохын тулд эхлээд нэвтэрнэ үү.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={authSignInHref("/school")}
          className="flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-[#cfe3df] bg-[#f4fbf9] px-4 py-3 text-center text-base font-semibold text-[#1f3b58] shadow-sm transition hover:border-teal-400 hover:bg-teal-50"
        >
          Сургууль нэвтрэх
        </Link>
        <Link
          href={authSignInHref("/teacher")}
          className="flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 text-center text-base font-semibold text-white shadow-md transition hover:from-teal-700 hover:to-cyan-700"
        >
          Багш нэвтрэх
        </Link>
      </div>

      <p className="mt-4 text-center text-sm text-[#6b7894]">
        Шинэ хэрэглэгч?{" "}
        <Link
          href={authSignUpHref("/teacher")}
          className="font-semibold text-teal-700 underline-offset-2 hover:underline"
        >
          Бүртгүүлэх (багш)
        </Link>
        {" · "}
        <Link
          href={authSignUpHref("/school")}
          className="font-semibold text-[#5b6883] underline-offset-2 hover:underline"
        >
          сургууль
        </Link>
      </p>

      <p className="mt-2 text-center text-sm text-[#6b7894]">
        Сурагчийн орчин дараагийн шатанд нэмэгдэнэ.
      </p>
    </div>
  );
}
