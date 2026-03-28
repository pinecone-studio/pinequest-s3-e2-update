import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type SearchParams = { error?: string | string[] };

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { userId } = await auth();
  if (userId) {
    const clerkUser = await currentUser();
    const readRole = (meta: unknown): string | undefined => {
      if (!meta || typeof meta !== "object") return undefined;
      const r = (meta as Record<string, unknown>).role;
      return typeof r === "string" ? r : undefined;
    };
    const role =
      readRole(clerkUser?.publicMetadata) ??
      readRole(clerkUser?.unsafeMetadata);
    if (role === "teacher") redirect("/teacher");
    if (role === "school_admin" || role === "admin") redirect("/school");
    redirect("/teacher");
  }

  const sp = searchParams ? await searchParams : {};
  const raw = sp.error;
  const loginError =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;

  return (
    <main className="h-screen bg-[#f4f4ee] text-[#1f242b]">
      <div className="mx-auto h-full w-378 max-w-full px-10 py-8">
        {loginError === "login" ? (
          <p className="mb-4 inline-flex rounded-xl border border-[#f3c2c2] bg-[#fff1f1] px-4 py-2 text-2 font-medium text-[#8a1f1f]">
            Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.
          </p>
        ) : null}
        {loginError === "auth" ? (
          <p className="mb-4 inline-flex rounded-xl border border-[#f2d9ab] bg-[#fff7e8] px-4 py-2 text-2 font-medium text-[#7b4f00]">
            Үргэлжлүүлэхийн тулд эхлээд нэвтэрнэ үү.
          </p>
        ) : null}

        <section className="grid h-full items-start gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-190">
            <header className="inline-flex justify-center items-center gap-2">
              <Image
                src="/bee.png"
                alt="Bee logo"
                width={50}
                height={50}
                priority
                className="h-10 w-10 object-contain"
              />
              <p className=" mt-2 text-[22px] font-black tracking-tight text-[#11161d]">
                UPDATE
              </p>
            </header>

            <div className="mt-12 flex items-center gap-4">
              <div className="flex items-center -space-x-3">
                {[
                  "/bagsh1.png",
                  "/bagsh2.png",
                  "/bagsh3.png",
                  "/bagsh4.png",
                ].map((src, idx) => (
                  <span
                    key={src}
                    className="h-12 w-12 rounded-full border-2 border-[#f4f4ee] bg-cover bg-center shadow-sm"
                    style={{
                      backgroundImage: `url('${src}')`,
                      backgroundPosition: "center",
                      zIndex: 10 - idx,
                    }}
                  />
                ))}
              </div>
              <p className="text-2 text-[#262d35]">
                10,000+ сурагч, багш ашиглаж байна
              </p>
            </div>

            <h1 className="mt-10 text-[42px] font-black leading-tight tracking-tight text-[#0f141b]">
              UPDATE Шалгалтын
              <br />
              Нэгдсэн Платформ
            </h1>
            <p className="mt-6 text-2 leading-relaxed text-[#2d333b]">
              Шалгалт бэлтгэх, авах, үнэлэх бүх процессыг
              <br />
              илүү ойлгомжтой, хурдан, найдвартай болгоно.
            </p>

            <article className="mt-10 h-60 w-125 rounded-[14px] border border-[#efe6b4] bg-[#fefce6] p-6 shadow-[0_0_12px_rgba(255,197,0,0.44)] transition hover:border-[#ffcf4d] hover:shadow-[0_0_16px_rgba(255,197,0,0.56)]">
              <div className="flex items-start gap-5">
                <Image
                  src="/teacher.png"
                  alt="Teacher testimonial"
                  width={76}
                  height={76}
                  className="h-19 w-19 rounded-xl object-cover"
                />
                <div>
                  <p className="text-2 font-extrabold leading-tight text-[#3a2614]">
                    Багш: О.Наранзул
                  </p>
                  <p className="mt-1 text-2 text-[#2f3640]">16-р сургууль</p>
                  <div className="mt-3 h-px w-78 bg-[#c8c4a8]" />
                </div>
              </div>
              <p className="mt-4 text-2 leading-snug text-[#14181f]">
                Шалгалт авах процесс ойлгомжтой болсон.
                <br />
                Цаг хэмнэж, сурагчдаа үр дүнтэй хянах боломж бүрдсэн.
                <br />
              </p>
            </article>

            <div className="mt-10 flex items-center gap-3">
              <Link
                href="/school"
                className="inline-flex h-14 w-40 items-center justify-center rounded-lg bg-[#ffdf00] p-2 text-2 font-semibold text-[#1f2227] transition hover:brightness-95"
              >
                Сургууль
              </Link>
              <Link
                href="/teacher"
                className="inline-flex h-14 w-40 items-center justify-center rounded-lg bg-[#ffdf00] p-2 text-2 font-semibold text-[#1f2227] transition hover:brightness-95"
              >
                Багш
              </Link>
            </div>
          </div>

          <div className="relative -ml-45 mt-20 flex min-h-190 items-start justify-start">
            <div className="relative h-90 w-140">
              <Image
                src="/path.png"
                alt="Path"
                width={780}
                height={420}
                priority
                className="absolute left-0 top-28 h-auto w-155 object-contain object-left"
              />
              <Image
                src="/text.png"
                alt="This way text"
                width={460}
                height={260}
                priority
                className="absolute left-105 top-47 h-auto w-57 object-contain"
              />
              <Image
                src="/bee.png"
                alt="Bee"
                width={120}
                height={120}
                priority
                className="absolute left-149 top-25 h-23 w-23 object-contain"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
