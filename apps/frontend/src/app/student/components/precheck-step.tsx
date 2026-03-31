type PrecheckStepProps = {
  examTitle: string;
  durationMinutes: number;
  canStart: boolean;
  startButtonLabel: string;
  statusText: string;
  studentEmail: string;
  onStart: () => void;
};

export function PrecheckStep({
  examTitle,
  durationMinutes,
  canStart,
  startButtonLabel,
  statusText,
  studentEmail,
  onStart,
}: PrecheckStepProps) {
  return (
    <main className="min-h-screen bg-[#f3f6fb] px-3 py-6 text-[#1f2a44] sm:px-4 sm:py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#dbe3f0] bg-white p-4 shadow-[0_14px_40px_rgba(27,39,80,0.08)] sm:rounded-3xl sm:p-8">
        <h1 className="text-balance text-4 font-extrabold text-[#ef4444] sm:text-6">
          Шалгалтын журам
        </h1>

        <div className="mt-6 grid gap-4 rounded-2xl border border-[#dbe3f0] bg-[#f8fbff] p-4 sm:grid-cols-2">
          <p className="text-3">
            <span className="font-semibold text-[#3b4d73]">Шалгалт:</span>{" "}
            {examTitle}
          </p>
          <p className="text-3">
            <span className="font-semibold text-[#3b4d73]">Шалгалт үргэлжлэх хугацаа:</span>{" "}
            {durationMinutes} минут
          </p>
          <p className="text-3">
            <span className="font-semibold text-[#3b4d73]">И-мэйл:</span>{" "}
            {studentEmail}
          </p>
          <p className="text-3 sm:col-span-2">
            <span className="font-semibold text-[#3b4d73]">Төлөв:</span>{" "}
            {statusText}
          </p>
        </div>

        <ul className="mt-5 list-disc space-y-2 pl-6 text-3 text-[#4e6088]">
          <li>Tab солихыг хориглоно</li>{" "}
          <li>Гарсан бол буцаж орох боломжгүй</li>
          <li>Асуултаа алгасаж дараа нь буцаж хариулах боломжтой</li>
          <li>Дуусгах товч дарсны дараа засварлах боломжгүйг анхаарна уу</li>
        </ul>

        <div className="mt-6 flex justify-stretch sm:justify-end">
          <button
            type="button"
            disabled={!canStart}
            onClick={onStart}
            className="w-full rounded-xl bg-[#2563eb] px-5 py-3 text-3 font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-[#9dbaf6] sm:w-auto sm:py-2.5"
          >
            {startButtonLabel}
          </button>
        </div>
      </div>
    </main>
  );
}
