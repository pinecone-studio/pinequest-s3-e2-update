import Image from "next/image";

type EntryStepProps = {
  classCode: string;
  hasAcceptedRules: boolean;
  classCodeHint?: string;
  classCodeRequired?: boolean;
  /** Хоосон биш байвал «Үргэлжлүүлэх»-ийн алдааг харуулна */
  proceedError?: string | null;
  onChangeClassCode: (value: string) => void;
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
      className="h-9.5 w-full rounded-xl border border-[#E5E5E5] bg-white px-6 text-[18px] font-normal text-[#262626] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#4ca2ff] focus:ring-4 focus:ring-[#4ca2ff]/10"
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
  proceedError = null,
  onChangeClassCode,
  onToggleAcceptedRules,
  onProceed,
}: EntryStepProps) {
  const canProceed = hasAcceptedRules && classCode.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-8 text-[#1f2a44] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-191.5 flex-col rounded-[18px] bg-[#eaf4ff] px-7 py-8 shadow-[0_22px_50px_rgba(15,23,42,0.12)] lg:min-h-127.5 lg:px-10 lg:py-10">
        <div className="grid items-center gap-2 lg:grid-cols-[1fr_220px] lg:gap-2">
          <div className="text-center lg:pl-6">
            <h1 className="text-[21px] font-medium leading-tight text-[#262626] lg:text-[21px]">
              Шалгалтын журамтай танилцан нэвтэрнэ үү!
            </h1>
          </div>

          <div className="flex">
            <div className="relative h-24.25 w-30.5">
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

        <section className="mt-2 rounded-[14px] border border-[#b8d9ff] bg-[#d7ecff] px-6 py-5">
          <div>
            <ul className="list-disc space-y-2 pl-6 font-normal text-[18px] text-[#111827]">
              <li>Асуултаа алгасаж, дараа нь буцаж хариулах боломжтой.</li>
              <li>Гарсан бол буцаж орох боломжгүй.</li>
              <li>Tab солихыг хориглоно!</li>
              <li>Цаг дуусахад автоматаар хаагдана.</li>
              <li>Дуусгах товч дарсны дараа засварлах боломжгүй.</li>
            </ul>
          </div>

          <label className="mt-5 inline-flex w-fit cursor-pointer items-center gap-3 text-[15px] font-medium text-[#111827]">
            <input
              checked={hasAcceptedRules}
              className="h-4.5 w-4.5 rounded border border-[#9ca3af]"
              type="checkbox"
              onChange={(event) => onToggleAcceptedRules(event.target.checked)}
            />
            <span>Уншиж танилцсан</span>
          </label>

          <div className="mt-5">
            <EntryInput
              placeholder={
                classCodeRequired
                  ? "Шалгалтын код оруулах"
                  : "Шалгалтын код оруулах"
              }
              value={classCode}
              onChange={onChangeClassCode}
            />
          </div>
        </section>

        {proceedError ? (
          <p
            className="mt-6 text-center text-[15px] font-medium text-red-600"
            role="alert"
          >
            {proceedError}
          </p>
        ) : null}

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onProceed}
            disabled={!canProceed}
            className="inline-flex h-9.5 min-w-43.75 items-center justify-center rounded-md bg-[#349af2] px-4 py-2 text-[20px] font-medium text-white transition hover:bg-[#2689df] disabled:cursor-not-allowed disabled:bg-[#9ca3af] disabled:hover:bg-[#9ca3af]"
          >
            Шалгалтанд орох
          </button>
        </div>
      </div>
    </main>
  );
}
