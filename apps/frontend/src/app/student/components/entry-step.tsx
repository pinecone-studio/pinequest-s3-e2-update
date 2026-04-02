import Image from "next/image";

type EntryStepProps = {
  classCode: string;
  hasAcceptedRules: boolean;
  classCodeHint?: string;
  classCodeRequired?: boolean;
  /** false бол ангийн/шалгалтын кодын талбарыг нуух (зөвхөн сурагчийн код). */
  showClassCodeField?: boolean;
  /** Сурагчийн код (studentExamAuth) — шаардлагатай үед. */
  studentCode?: string;
  studentCodeRequired?: boolean;
  onChangeStudentCode?: (value: string) => void;
  /** Хоосон биш байвал «Үргэлжлүүлэх»-ийн алдааг харуулна */
  proceedError?: string | null;
  onChangeClassCode?: (value: string) => void;
  onToggleAcceptedRules: (checked: boolean) => void;
  onProceed: () => void;
};

function EntryInput({
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-base font-normal text-[#262626] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#4ca2ff] focus:ring-4 focus:ring-[#4ca2ff]/10 sm:h-9.5 sm:px-6 sm:text-[18px]"
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function EntryStep({
  classCode,
  hasAcceptedRules,
  classCodeHint,
  classCodeRequired = false,
  showClassCodeField = true,
  studentCode = "",
  studentCodeRequired = false,
  onChangeStudentCode,
  proceedError = null,
  onChangeClassCode,
  onToggleAcceptedRules,
  onProceed,
}: EntryStepProps) {
  const needsClassField =
    showClassCodeField &&
    (classCodeRequired || classCode.trim().length > 0);
  const canProceed =
    hasAcceptedRules &&
    (!needsClassField || classCode.trim().length > 0) &&
    (!studentCodeRequired ||
      (studentCode.trim().length > 0 && Boolean(onChangeStudentCode)));

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-3 py-6 text-[#1f2a44] sm:px-5 sm:py-8 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[49rem] flex-col rounded-[18px] bg-[#eaf4ff] px-4 py-6 shadow-[0_22px_50px_rgba(15,23,42,0.12)] sm:px-6 sm:py-8 lg:min-h-127.5 lg:px-10 lg:py-10">
        <div className="relative flex flex-col items-center gap-4 sm:gap-5 lg:pr-28">
          <div className="text-center">
            <h1 className="text-[22px] font-semibold leading-tight text-[#2b2b2b] sm:text-[28px]">
              <span className="block">Шалгалтын журамтай</span>
              <span className="block">танилцан нэвтэрнэ үү!</span>
            </h1>
          </div>

          <div className="flex justify-center lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
            <div className="relative h-24.25 w-30.5 shrink-0">
              <div className="absolute left-0 top-6.5 z-10 px-2 py-1">
                <p className="text-[18px] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#151515]">
                  Busy
                  <br />
                  Bee
                </p>
              </div>
              <Image
                src="/macbee.png"
                alt="Busy bee"
                width={100}
                height={100}
                priority
                className="absolute right-0 top-1.5 h-auto w-14 object-contain"
              />
            </div>
          </div>
        </div>

        <section className="mt-2 rounded-[14px] border border-[#b8d9ff] bg-[#d7ecff] px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <ul className="list-disc space-y-2 pl-5 font-normal text-sm text-[#111827] sm:pl-6 sm:text-base md:text-[18px]">
              <li>Асуултаа алгасаж, дараа нь буцаж хариулах боломжтой.</li>
              <li>Гарсан бол буцаж орох боломжгүй.</li>
              <li>Tab солихыг хориглоно!</li>
              <li>Цаг дуусахад автоматаар хаагдана.</li>
              <li>Дуусгах товч дарсны дараа засварлах боломжгүй.</li>
            </ul>
          </div>

          <label className="mt-5 inline-flex w-full max-w-full cursor-pointer items-start gap-3 text-sm font-medium text-[#111827] sm:w-fit sm:items-center sm:text-[15px]">
            <input
              checked={hasAcceptedRules}
              className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded border border-[#9ca3af] sm:mt-0"
              type="checkbox"
              onChange={(event) => onToggleAcceptedRules(event.target.checked)}
            />
            <span className="min-w-0 leading-snug">Уншиж танилцсан</span>
          </label>

          <div className="mt-5 space-y-4">
            {showClassCodeField ? (
              <EntryInput
                placeholder={
                  classCodeRequired
                    ? "Ангийн код оруулах (жишээ нь 10A)"
                    : "Ангийн код (сонголттой)"
                }
                value={classCode}
                onChange={(value) => onChangeClassCode?.(value)}
              />
            ) : null}
            {studentCodeRequired && onChangeStudentCode ? (
              <div>
                <p className="mb-1.5 text-left text-[14px] font-medium text-[#374151]">
                  Сурагчийн код
                </p>
                <EntryInput
                  placeholder="Жишээ: 6 оронтой код"
                  value={studentCode}
                  onChange={onChangeStudentCode}
                />
              </div>
            ) : null}
          </div>
        </section>

        {proceedError ? (
          <p
            className="mt-6 break-words px-1 text-center text-sm font-medium text-red-600 sm:text-[15px]"
            role="alert"
          >
            {proceedError}
          </p>
        ) : null}

        <div className="mt-8 flex items-stretch justify-center sm:mt-10 sm:items-center">
          <button
            type="button"
            onClick={onProceed}
            disabled={!canProceed}
            className="inline-flex h-11 w-full max-w-md items-center justify-center rounded-md bg-[#349af2] px-4 py-2 text-base font-medium text-white transition hover:bg-[#2689df] disabled:cursor-not-allowed disabled:bg-[#9ca3af] disabled:hover:bg-[#9ca3af] sm:h-9.5 sm:w-auto sm:min-w-43.75 sm:text-[20px]"
          >
            Шалгалтанд орох
          </button>
        </div>
      </div>
    </main>
  );
}
