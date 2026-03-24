import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef3f9] px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-[#d9dee8] bg-white p-8 shadow-sm">
        <div className="flex justify-center flex-wrap gap-1">
          <p className="text-lg font-semibold text-[#5c6a87]">Rubrix систем</p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#1f2a44]">
            Шалгалтын платформд нэвтрэх
          </h1>
          <p className="text-sm text-[#4a5875]">
            Өөрийн эрхээр нэвтэрч, тохирох орчинд ажиллана уу.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/teacher"
            className="rounded-2xl bg-[#4ca3f0] px-5 py-4 text-center text-base font-bold text-white transition hover:bg-[#3996ea]"
          >
            Teacher хэсэг рүү орох
          </Link>
          <button
            type="button"
            className="rounded-2xl border border-[#d9dee8] bg-[#f8fafc] px-5 py-4 text-base font-semibold text-[#2f3c59]"
          >
            Student (удахгүй)
          </button>
        </div>
      </section>
    </main>
  );
}
