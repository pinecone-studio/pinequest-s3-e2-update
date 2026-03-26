type PrecheckStepProps = {
  examTitle: string;
  durationMinutes: number;
  studentEmail: string;
  onStart: () => void;
};

export function PrecheckStep({
  examTitle,
  durationMinutes,
  studentEmail,
  onStart,
}: PrecheckStepProps) {
  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-10 text-[#1f2a44]">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#dbe3f0] bg-white p-8 shadow-[0_14px_40px_rgba(27,39,80,0.08)]">
        <h1 className="text-6 font-extrabold text-[#ef4444]">
          Шалгалтын журам
        </h1>

        <div className="mt-6 grid gap-4 rounded-2xl border border-[#dbe3f0] bg-[#f8fbff] p-4 sm:grid-cols-2">
          <p className="text-3">
            <span className="font-semibold text-[#3b4d73]">Шалгалт:</span>{" "}
            {examTitle}
          </p>
          <p className="text-3">
            <span className="font-semibold text-[#3b4d73]">Хугацаа:</span>{" "}
            {durationMinutes} минут
          </p>
          <p className="text-3">
            <span className="font-semibold text-[#3b4d73]">И-мэйл:</span>{" "}
            {studentEmail}
          </p>
        </div>

        <ul className="mt-5 list-disc space-y-2 pl-6 text-3 text-[#4e6088]">
          <li>Tab солихыг хориглоно</li>{" "}
          <li>Гарсан бол буцаж орох боломжгүй</li>
          <li>Асуултаа алгасаж дараа нь буцаж хариулах боломжтой</li>
          <li>Дуусгах товч дарсны дараа засварлах боломжгүйг анхаарна уу</li>
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onStart}
            className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-3 font-semibold text-white hover:bg-[#1d4ed8]"
          >
            Шалгалт эхлүүлэх
          </button>
        </div>
      </div>
    </main>
  );
}
