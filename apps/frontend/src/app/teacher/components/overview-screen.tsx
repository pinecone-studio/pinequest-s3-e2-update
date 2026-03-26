import { Check, Eye, Sparkles } from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import { useState } from "react";

type OverviewScreenProps = {
  onOpenReview: () => void;
};

type Student = {
  initial: string;
  name: string;
  email: string;
};

type AnswerData = {
  submittedAt: string;
  text: string;
  aiScore: number;
  aiFeedback: string;
  confidence: "high" | "medium" | "low";
};

const students: Student[] = [
  { initial: "Б", name: "Батбаяр Доржсүрэн", email: "batbayar@school.mn" },
  { initial: "С", name: "Сарангэрэл Энхбат", email: "sarangerel@school.mn" },
  { initial: "Ө", name: "Өлзий-Орших Түвшин", email: "olzii@school.mn" },
  { initial: "М", name: "Мөнхзул Баттулга", email: "munkhzul@school.mn" },
  { initial: "Г", name: "Ганбат Цэцэг", email: "ganbat@school.mn" },
  { initial: "Н", name: "Нарантуяа Булган", email: "narantuya@school.mn" },
];

const answers: AnswerData[] = [
  {
    submittedAt: "3/20/2026, 6:30:00 PM",
    text: "Монгол Улсын Үндсэн хууль нь 1992 онд батлагдсан бөгөөд манай улсын хамгийн дээд хууль юм. Үндсэн хуулийн гол зарчмуудад ардчилал, хүний эрх, хууль дээдлэх зэрэг багтдаг.",
    aiScore: 16,
    aiFeedback:
      "Хариулт нь үндсэн зарчмуудыг сайн тодорхойлсон боловч зарим жишээ нь илүү тодорхой байх шаардлагатай.",
    confidence: "high",
  },
  {
    submittedAt: "3/20/2026, 6:45:00 PM",
    text: "Үндсэн хуулийн чухал зарчмууд: ардчилал, хүний эрх, хууль дээдлэх, эрх мэдлийн тусгаарлалт. Эдгээр зарчим одоо хэрэгжиж байна гэж боддог.",
    aiScore: 9,
    aiFeedback:
      "Хариулт хэтэрхий товч бөгөөд гүнзгий тайлбар дутмаг. Илүү дэлгэрэнгүй хариулт шаардлагатай.",
    confidence: "high",
  },
  {
    submittedAt: "3/20/2026, 7:00:00 PM",
    text: "Ардчилал, хүний эрх, хууль дээдлэх нь үндсэн зарчим юм. Төрийн байгууллагууд эдгээрийг хамгаалах ёстой.",
    aiScore: 12,
    aiFeedback:
      "Суурь ойлголт зөв боловч бүтэц, жишээ болон шүүмжлэлтэй дүгнэлт дутуу байна.",
    confidence: "medium",
  },
  {
    submittedAt: "3/20/2026, 7:10:00 PM",
    text: "Үндсэн хууль нь иргэн бүрийн эрх, төрийн бүтэц, хууль дээдлэх зарчмыг тогтоодог чухал баримт бичиг.",
    aiScore: 14,
    aiFeedback:
      "Хариулт тогтвортой, ойлгомжтой. Жишээ бага зэрэг нэмбэл илүү сайн.",
    confidence: "high",
  },
  {
    submittedAt: "3/20/2026, 7:20:00 PM",
    text: "Монгол Улс ардчилсан улс учраас сонгууль, үг хэлэх эрх чөлөө, шүүхийн хараат бус байдал чухал.",
    aiScore: 13,
    aiFeedback:
      "Үндсэн санаа зөв ч тайлбарын гүн дутмаг. Зохион байгуулалт сайжруулах шаардлагатай.",
    confidence: "medium",
  },
  {
    submittedAt: "3/20/2026, 7:30:00 PM",
    text: "Үндсэн хууль бол төрийн эрх мэдлийн хуваарилалт, иргэний эрх чөлөөг баталгаажуулдаг тул нийгмийн суурь хууль юм.",
    aiScore: 15,
    aiFeedback: "Сайн хариулт. Илүү бодит жишээ нэмбэл төгс болно.",
    confidence: "high",
  },
];

export default function OverviewScreen({ onOpenReview }: OverviewScreenProps) {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [teacherScore, setTeacherScore] = useState<number>(0);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [studentAnswerImages, setStudentAnswerImages] = useState<
    (string | null)[]
  >(Array(students.length).fill(null));

  const currentStudent = students[currentStudentIndex];
  const currentAnswer = answers[currentStudentIndex];

  const resetWorkflow = () => {
    setAiGenerated(false);
    setIsApproved(false);
    setIsGenerating(false);
    setTeacherScore(0);
    setTeacherFeedback("");
  };

  const goToStudent = (index: number) => {
    setCurrentStudentIndex(index);
    resetWorkflow();
  };

  const handleQuestionImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setQuestionImage(imageUrl);
  };

  const handleStudentImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setStudentAnswerImages((prev) => {
      const next = [...prev];
      next[currentStudentIndex] = imageUrl;
      return next;
    });
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setIsApproved(false);

    setTimeout(() => {
      setAiGenerated(true);
      setTeacherScore(currentAnswer.aiScore);
      setIsGenerating(false);
    }, 1200);
  };

  const handleApprove = () => {
    setIsApproved(true);

    setTimeout(() => {
      const nextIndex = currentStudentIndex + 1;

      if (nextIndex < students.length) {
        goToStudent(nextIndex);
      } else {
        resetWorkflow();
      }
    }, 1300);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf4ff] text-4 text-[#4f9dff] disabled:opacity-40"
                disabled={currentStudentIndex === 0}
                onClick={() =>
                  currentStudentIndex > 0 &&
                  goToStudent(currentStudentIndex - 1)
                }
                type="button"
              >
                ‹
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4f9dff] text-4 font-bold text-white">
                {currentStudent.initial}
              </div>
              <div>
                <p className="text-4 font-extrabold">{currentStudent.name}</p>
                <p className="text-4 text-[#66708a]">{currentStudent.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4 font-bold text-[#66708a]">
                {currentStudentIndex + 1} / {students.length}
              </span>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf4ff] text-4 text-[#4f9dff] disabled:opacity-40"
                disabled={currentStudentIndex === students.length - 1}
                onClick={() =>
                  currentStudentIndex < students.length - 1 &&
                  goToStudent(currentStudentIndex + 1)
                }
                type="button"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf4ff] text-4 font-semibold text-[#4f9dff]">
                  1
                </div>
                <p className="text-4 font-semibold text-[#6b7289]">Асуулт</p>
              </div>

              {questionImage ? (
                <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-[#d9dee8]">
                  <Image
                    alt="Асуултын зураг"
                    className="object-cover"
                    fill
                    src={questionImage}
                    unoptimized
                  />
                </div>
              ) : (
                <label className="flex h-10 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#c9d2e3] bg-[#eef6ff] text-4 text-[#6b7289]">
                  File upload
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handleQuestionImageUpload}
                    type="file"
                  />
                </label>
              )}

              {questionImage && (
                <label className="mt-3 inline-flex cursor-pointer rounded-xl border border-[#d9dee8] px-3 py-2 text-4 text-[#4f9dff]">
                  Зураг солих
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handleQuestionImageUpload}
                    type="file"
                  />
                </label>
              )}

              <div className="mt-4 flex items-center gap-4 text-4">
                <span className="rounded-full bg-[#fff3c8] px-3 py-1 font-semibold text-[#7a6420]">
                  Нээлттэй хариулт
                </span>
                <span className="text-[#6b7289]">Оноо: 20</span>
              </div>
            </section>

            <section className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm">
              <p className="mb-4 text-4 font-semibold text-[#6b7289]">
                Сурагчийн хариулт
              </p>

              {studentAnswerImages[currentStudentIndex] ? (
                <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-[#d9dee8]">
                  <Image
                    alt="Сурагчийн хариултын зураг"
                    className="object-cover"
                    fill
                    src={studentAnswerImages[currentStudentIndex] || ""}
                    unoptimized
                  />
                </div>
              ) : (
                <label className="flex h-10 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#c9d2e3] bg-[#eef6ff] text-4 text-[#6b7289]">
                  File upload
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handleStudentImageUpload}
                    type="file"
                  />
                </label>
              )}

              {studentAnswerImages[currentStudentIndex] && (
                <label className="mt-3 inline-flex cursor-pointer rounded-xl border border-[#d9dee8] px-3 py-2 text-4 text-[#4f9dff]">
                  Зураг солих
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handleStudentImageUpload}
                    type="file"
                  />
                </label>
              )}

              {!studentAnswerImages[currentStudentIndex] && (
                <div className="mt-4 rounded-2xl bg-[#eef6ff] p-5 text-4 leading-relaxed text-[#2d3a56]">
                  {currentAnswer.text}
                </div>
              )}

              <p className="mt-4 text-4 text-[#7a8095]">
                Илгээсэн: {currentAnswer.submittedAt}
              </p>
            </section>

            <button
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-[#d9dee8] bg-white py-5 text-4 font-medium text-[#2f3c59] transition-all duration-200 hover:border-[#4f9dff] hover:text-[#4f9dff]"
              onClick={onOpenReview}
              type="button"
            >
              <Eye className="h-5 w-5 text-[#2f3c59] transition-colors duration-200 group-hover:text-[#4f9dff]" />
              <span>Сурагчийн харагдац</span>
            </button>
          </div>

          <div className="space-y-4">
            {!aiGenerated && !isApproved && (
              <button
                className="w-full rounded-2xl bg-[#4f9dff] px-2 py-4 text-4 font-bold text-white transition hover:bg-[#3f8ff5] disabled:opacity-60"
                disabled={isGenerating}
                onClick={handleGenerateAI}
                type="button"
              >
                <span className="flex items-center justify-center gap-3">
                  <Sparkles
                    className={`h-5 w-5 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isGenerating
                      ? "AI үнэлгээ хийж байна..."
                      : "AI-аар шалгах"}
                  </span>
                </span>
              </button>
            )}

            {isApproved && (
              <section className="rounded-2xl border border-[#4f9dff] bg-[#4f9dff] p-8 text-center text-white shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-8 w-8" />
                </div>
                <p className="text-4 font-bold">Амжилттай батлагдлаа!</p>
                <p className="mt-2 text-4 text-white/90">
                  Дараагийн сурагч руу шилжиж байна...
                </p>
              </section>
            )}

            {aiGenerated && !isApproved && (
              <>
                <section className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-4 font-bold text-[#24314c]">
                      <Sparkles className="h-5 w-5 text-[#4f9dff]" />
                      AI Үнэлгээ
                    </h3>
                    <div
                      className={`rounded-full px-3 py-1 text-4 font-semibold ${
                        currentAnswer.confidence === "high"
                          ? "bg-[#deeeff] text-[#2f66b9]"
                          : currentAnswer.confidence === "medium"
                            ? "bg-[#fff3c8] text-[#7a6420]"
                            : "bg-[#ffe6e8] text-[#d44b5a]"
                      }`}
                    >
                      {currentAnswer.confidence === "high"
                        ? "Өндөр итгэлтэй"
                        : currentAnswer.confidence === "medium"
                          ? "Дунд итгэлтэй"
                          : "Бага итгэлтэй"}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#eef6ff] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-4 text-[#56627d]">AI оноо</p>
                      <p className="text-4 font-bold text-[#4f9dff]">
                        {currentAnswer.aiScore} / 20
                      </p>
                    </div>
                    <div className="h-3 rounded-full bg-[#d6deea]">
                      <div
                        className="h-3 rounded-full bg-[#4f9dff]"
                        style={{
                          width: `${(currentAnswer.aiScore / 20) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-4 font-semibold text-[#56627d]">
                    AI санал хүсэлт
                  </p>
                  <div className="mt-3 rounded-2xl bg-[#eef6ff] p-4 text-4 leading-relaxed text-[#2d3a56]">
                    {currentAnswer.aiFeedback}
                  </div>
                </section>

                <section className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm">
                  <p className="mb-4 text-4 font-bold text-[#24314c]">
                    Багшийн үнэлгээ
                  </p>

                  <label className="mb-2 block text-4 font-semibold text-[#6b7289]">
                    Оноо (Хамгийн ихдээ 20)
                  </label>
                  <input
                    className="w-full rounded-xl border border-[#d9dee8] px-4 py-3 text-4"
                    max={20}
                    min={0}
                    onChange={(event) =>
                      setTeacherScore(Number(event.target.value))
                    }
                    type="number"
                    value={teacherScore}
                  />

                  <label className="mb-2 mt-4 block text-4 font-semibold text-[#6b7289]">
                    Санал хүсэлт (Заавал биш)
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-[#d9dee8] px-4 py-3 text-4"
                    onChange={(event) => setTeacherFeedback(event.target.value)}
                    placeholder="Санал хүсэлт нэмэх..."
                    rows={4}
                    value={teacherFeedback}
                  />
                </section>

                <section className="rounded-2xl border border-[#cfe0fb] bg-[#eef6ff] p-6 shadow-sm">
                  <p className="mb-4 text-4 font-bold text-[#24314c]">
                    Эцсийн үр дүн
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-4 text-center">
                      <p className="text-4 text-[#6a738b]">AI оноо</p>
                      <p className="text-4 font-bold text-[#4f9dff]">
                        {currentAnswer.aiScore}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-4 text-center">
                      <p className="text-4 text-[#6a738b]">Багшийн оноо</p>
                      <p className="text-4 font-bold text-[#4f9dff]">
                        {teacherScore}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-white p-4 text-center">
                    <p className="text-4 text-[#6a738b]">Батлагдсан оноо</p>
                    <p className="text-4 font-bold text-[#2f66b9]">
                      {teacherScore} / 20
                    </p>
                  </div>

                  <button
                    className="mt-5 w-full rounded-xl bg-[#4f9dff] py-4 text-4 font-bold text-white"
                    onClick={handleApprove}
                    type="button"
                  >
                    ✓ Үр дүн батлах
                  </button>
                </section>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
