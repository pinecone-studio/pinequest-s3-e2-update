import Image from "next/image";

type EntryStepProps = {
  studentLastName: string;
  studentFirstName: string;
  studentEmail: string;
  classCode: string;
  canProceed: boolean;
  hasAcceptedRules: boolean;
  classCodeHint?: string;
  classCodeRequired?: boolean;
  onChangeLastName: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeClassCode: (value: string) => void;
  onApplyDemo: () => void;
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
  studentLastName,
  studentFirstName,
  studentEmail,
  classCode,
  canProceed,
  hasAcceptedRules,
  classCodeHint,
  classCodeRequired = false,
  onChangeLastName,
  onChangeFirstName,
  onChangeEmail,
  onChangeClassCode,
  onApplyDemo,
  onToggleAcceptedRules,
  onProceed,
}: EntryStepProps) {
  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-8 text-[#1f2a44] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-191.5 flex-col rounded-[18px] bg-[#eaf4ff] px-7 py-8 shadow-[0_22px_50px_rgba(15,23,42,0.12)] lg:min-h-127.5 lg:px-10 lg:py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_220px] lg:gap-8">
          <div className="text-center lg:pl-6">
            <h1 className="text-[21px] font-medium leading-tight text-[#262626] lg:text-[21px]">
              Доорх мэдээллийг бөглөөд
              <br /> шалгалтаа эхлүүлээрэй.
            </h1>
          </div>

          <div className="flex justify-center lg:justify-end">
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

        <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-x-8 md:gap-y-5">
          <EntryInput
            placeholder="Овог бичих"
            value={studentLastName}
            onChange={onChangeLastName}
          />
          <EntryInput
            placeholder="Нэр бичих"
            value={studentFirstName}
            onChange={onChangeFirstName}
          />
          <EntryInput
            placeholder="И-мэйл бичих"
            type="email"
            value={studentEmail}
            onChange={onChangeEmail}
          />
          <EntryInput
            placeholder={classCodeRequired ? "Анги оруулах" : "Анги оруулах"}
            value={classCode}
            onChange={onChangeClassCode}
          />
        </div>

        {classCodeHint ? (
          <p className="mt-4 text-center text-[14px] font-medium text-[#5f7394] md:text-left">
            {classCodeHint}
          </p>
        ) : null}

        <section className="mt-8 rounded-[14px] border border-[#b8d9ff] bg-[#d7ecff] px-6 py-5">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <h2 className="inline-flex w-fit border rounded-sm border-[#ff4d4f] px-3 py-1 text-[12px] font-medium text-[#ef4444]">
              Шалгалтын журам
            </h2>
            <label
              className={`inline-flex w-fit items-center gap-2 rounded-sm border bg-[#d7ecff] px-3 py-1 text-[12px] md:justify-self-start ${hasAcceptedRules ? "border-[#122459] text-[#122459]" : "border-[#A1A1A1] text-[#A1A1A1]"}`}
            >
              <input
                checked={hasAcceptedRules}
                className="peer sr-only"
                type="checkbox"
                onChange={(event) => onToggleAcceptedRules(event.target.checked)}
              />
              <span>
                Журамыг уншиж танилцсан
              </span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-[7px] border border-[#a1a1a1] bg-transparent text-transparent transition peer-checked:border-[#18c964] peer-checked:bg-transparent peer-checked:text-[#18c964]">
                <svg
                  aria-hidden="true"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5L6.5 12L13 4.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </svg>
              </span>
            </label>
          </div>

          <div className="mt-5 grid gap-1 md:grid-cols-2 md:gap-x-8">
            <ul className="list-disc space-y-2 pl-6 font-normal text-[12px] text-[#122459]">
              <li>Асуултаа алгасаж, дараа нь буцаж хариулах боломжтой.</li>
              <li>Гарсан бол буцаж орох боломжгүй.</li>
            </ul>
            <ul className="list-disc space-y-2 pl-6 font-normal text-[12px] text-[#DC2626]">
              <li>Tab солихыг хориглоно уу!</li>
              <li>Цаг дуусахад автоматаар хаагдах тул анхаарна уу!</li>
              <li>Дуусгах товч дарсны дараа засварлах боломжгүйг анхаарна уу!</li>
            </ul>
          </div>
        </section>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onApplyDemo}
            className="inline-flex h-9.5 min-w-20 items-center justify-center rounded-md bg-[#349af2] px-4 py-2 text-[18px] font-medium text-white transition hover:bg-[#2689df]"
          >
            Демо
          </button>
          <button
            type="button"
            disabled={!canProceed}
            onClick={onProceed}
            className={`inline-flex h-9.5 min-w-43.75 items-center justify-center rounded-md px-4 py-2 text-[20px] font-medium text-white transition ${
              canProceed
                ? "bg-[#349af2] hover:bg-[#2689df]"
                : "cursor-not-allowed bg-[#B8DCFF] text-white/90"
            }`}
          >
            Үргэлжлүүлэх
          </button>
        </div>
      </div>
    </main>
  );
}
