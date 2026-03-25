import { ArrowLeft } from "lucide-react";
import { STUDENTS_BY_CODE } from "../score-calculation/data/students";
import { store } from "@/app/lib/store";

type ReviewScreenProps = {
  onBack: () => void;
  studentCode?: string | null;
};

const DEFAULT_STUDENT = {
  name: "Батбаяр Доржсүрэн",
  email: "batbayar@school.mn",
  initial: "Б",
};

export default function ReviewScreen({
  onBack,
  studentCode,
}: ReviewScreenProps) {
  const resolvedStudent =
    studentCode && store.getStudentByNumber(studentCode)
      ? (() => {
          const s = store.getStudentByNumber(studentCode);
          if (!s) return null;
          return {
            name: `${s.firstName} ${s.lastName}`,
            email: `${s.studentNumber}@school.mn`,
            initial: s.firstName.charAt(0),
          };
        })()
      : studentCode && STUDENTS_BY_CODE[studentCode]
        ? (() => {
            const s = STUDENTS_BY_CODE[studentCode];
            return { name: s.name, email: s.email, initial: s.name.charAt(0) };
          })()
        : null;

  const { name, email, initial } = resolvedStudent
    ? resolvedStudent
    : DEFAULT_STUDENT;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-teal-600 hover:underline transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Буцах</span>
      </button>

      <section className="rounded-2xl border border-[#d9dee8] bg-white p-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-500 text-4 font-semibold text-white">
          {initial}
        </div>
        <p className="mt-5 text-4 font-extrabold">{name}</p>
        <p className="mt-1 text-4 text-[#7384a5]">{email}</p>
      </section>

      <section className="rounded-2xl border border-[#cde4d8] bg-[#d9ece2] p-8 text-center">
        <p className="text-4 font-semibold text-[#11a44c]">
          ◉ Шалгалт батлагдсан
        </p>
        <p className="mt-2 text-4 font-bold leading-none text-[#10b34f]">
          16<span className="text-4 text-[#24314c]">/20</span>
        </p>
        <p className="mt-2 text-4 font-semibold">80%</p>

        <div className="mx-auto mt-4 h-3 w-full max-w-md rounded-full bg-white/80">
          <div className="h-3 w-[80%] rounded-full bg-[#12b650]" />
        </div>

        <p className="mt-4 text-4 font-semibold text-[#1f2a44]">
          ☑ Тэнцсэн - Маш сайн!
        </p>
      </section>

      <section className="rounded-2xl border border-[#d9dee8] bg-white p-5">
        <p className="mb-3 text-4 font-semibold">Асуулт</p>
        <div className="rounded-2xl bg-teal-50 p-4 text-4 leading-relaxed">
          Монгол Улсын Үндсэн хуулийн гол зарчмуудыг тайлбарлаж, өнөөгийн
          нийгэмд хэрхэн хэрэгжиж байгааг жишээ дээр тодруулна уу?
        </div>

        <p className="mb-3 mt-5 text-4 font-semibold">Таны хариулт</p>
        <div className="rounded-2xl bg-teal-50 p-4 text-4 leading-relaxed">
          Монгол Улсын Үндсэн хууль нь 1992 онд батлагдсан бөгөөд манай улсын
          хамгийн дээд хууль юм. Үндсэн хуулийн гол зарчмуудад ардчилал, хүний
          эрх, үндэсний тогтвортой байдал, хууль дээдлэх ёс зэрэг багтдаг.
          Өнөөдөр эдгээр зарчмууд манай нийгэмд олон талаар хэрэгжиж байна.
          Жишээ нь, сонгуулийн эрх, үг хэлэх эрх чөлөө, шүүхийн хараат бус
          байдал зэрэг нь ардчилсан зарчмын илрэл юм.
        </div>
      </section>

      <section className="rounded-2xl border border-[#d9dee8] bg-white p-5">
        <p className="mb-3 text-4 font-semibold">Санал хүсэлт</p>
        <div className="rounded-2xl bg-teal-50 p-4 text-4 leading-relaxed">
          Хариулт нь үндсэн зарчмуудыг сайн тодорхойлсон боловч зарим жишээ нь
          илүү тодорхой байх шаардлагатай. Авлига, ядуурал зэрэг асуудлуудыг
          дурдсан нь сайн, гэхдээ эдгээр нь Үндсэн хуулийн хэрэгжилттэй яаж
          холбогдож байгааг тодруулаагүй байна.
        </div>
      </section>

      <section className="rounded-2xl border border-[#ddd7c6] bg-[#eeebdd] p-5">
        <p className="mb-3 text-4 font-semibold">Хөгжлийн чиглэл</p>
        <div className="text-4 leading-relaxed">
          <p>Маш сайн ажилласан!</p>
          <p>· Үндсэн ойлголтуудыг сайн ойлгосон байна.</p>
          <p>· Жишээнүүдийг тодорхой бөгөөд хамааралтай.</p>
          <p>· Илүү гүнзгий тайлбар нэмэж, критик сэтгэлгээгээ хөгжүүлээрэй.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d9dee8] bg-white p-5">
        <p className="mb-3 text-4 font-semibold">Дараагийн алхам</p>
        <div className="space-y-3">
          <div className="rounded-2xl bg-teal-50 p-4">
            <p className="text-4 font-bold">
              Санал хүсэлтийг анхааралтай уншаарай
            </p>
            <p className="mt-1 text-4">
              Багш ямар зүйлийг сайжруулах хэрэгтэйг хэлж байгааг ойлгоорой
            </p>
          </div>

          <div className="rounded-2xl bg-teal-50 p-4">
            <p className="text-4 font-bold">
              Үндсэн материалыг давтан судлаарай
            </p>
            <p className="mt-1 text-4">
              Ангийн тэмдэглэл, номоо дахин уншаад мэдлэгээ бэхжүүлээрэй
            </p>
          </div>

          <div className="rounded-2xl bg-teal-50 p-4">
            <p className="text-4 font-bold">
              Асуулт байвал багштайгаа ярилцаарай
            </p>
            <p className="mt-1 text-4">Багш танд туслахад таатай байх болно</p>
          </div>
        </div>
      </section>
    </main>
  );
}
