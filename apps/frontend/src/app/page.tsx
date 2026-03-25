import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-teal-50 px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-[#d9dee8] bg-white p-8 shadow-sm">
        <div className="flex justify-center flex-wrap gap-1">
          <h1 className="mt-2 text-2xl font-extrabold text-[#1f2a44]">
            Шалгалтын платформ
          </h1>
          <p className="text-sm text-[#4a5875]">
            Захиргаа эсвэл багшийн орчныг сонгоно уу.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/admin"
            className="rounded-2xl bg-teal-600 px-5 py-4 text-center text-base font-bold text-white transition hover:bg-teal-700"
          >
            Захиргааны хэсэг (шууд)
          </Link>
          <Link
            href="/teacher"
            className="rounded-2xl border border-[#d9dee8] bg-[#f8fafc] px-5 py-4 text-center text-base font-semibold text-[#2f3c59] transition hover:bg-teal-100"
          >
            Teacher хэсэг (шууд)
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-[#6b7894]">
          Student орчин удахгүй нээгдэнэ.
        </p>
      </section>
    </main>
  );
}
