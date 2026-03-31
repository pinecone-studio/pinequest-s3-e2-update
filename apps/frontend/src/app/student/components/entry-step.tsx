import Image from "next/image";
import Link from "next/link";

type EntryStepProps = {
  studentLastName: string;
  studentFirstName: string;
  studentEmail: string;
  classCode: string;
  canProceed: boolean;
  classCodeHint?: string;
  classCodeRequired?: boolean;
  onChangeLastName: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeClassCode: (value: string) => void;
  onApplyDemo: () => void;
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
      className="h-16 w-full rounded-[14px] border border-[#8b9199] bg-white px-5 text-[18px] font-normal text-[#2b2f36] outline-none transition placeholder:text-[#b2b2b2] focus:border-[#4ca2ff] focus:ring-4 focus:ring-[#4ca2ff]/10"
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
  classCodeHint,
  classCodeRequired = false,
  onChangeLastName,
  onChangeFirstName,
  onChangeEmail,
  onChangeClassCode,
  onApplyDemo,
  onProceed,
}: EntryStepProps) {
  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-8 text-[#1f2a44] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-383.5 flex-col rounded-[18px] bg-[#eaf4ff] px-8 py-12 shadow-[0_22px_50px_rgba(15,23,42,0.12)] sm:px-12 sm:py-14 lg:min-h-188.5 lg:px-17 lg:py-18">
        <div className="grid items-center gap-8 lg:grid-cols-[320px_1fr] lg:gap-14">
          <div className="flex justify-center lg:justify-start">
            <div className="relative h-47.5 w-60">
              <div className="absolute left-0 top-13.5 z-10 px-3 py-2">
                <p className="text-[38px] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#151515]">
                  Busy
                  <br />
                  Bee
                </p>
              </div>
              <Image
                src="/macbee.png"
                alt="Busy bee"
                width={140}
                height={140}
                priority
                className="absolute right-3 top-3 h-auto w-39 object-contain"
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-[42px] font-medium leading-[1.28] text-[#262626] sm:text-[46px] lg:text-[58px]">
              Доорх мэдээллийг бөглөөд
              <br className="hidden sm:block" /> шалгалтаа эхлүүлээрэй.
            </h1>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-x-27 md:gap-y-6">
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

        <div className="mt-16 flex justify-center">
          <button
            type="button"
            disabled={!canProceed}
            onClick={onProceed}
            className="inline-flex min-w-85 items-center justify-center rounded-[14px] bg-[#85befc] px-8 py-5 text-[24px] font-medium text-white transition hover:bg-[#69acfb] disabled:cursor-not-allowed disabled:bg-[#b7d9ff] disabled:text-white/90"
          >
            Үргэлжлүүлэх
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-center gap-3 pt-8">
          <button
            type="button"
            onClick={onApplyDemo}
            className="rounded-xl border border-[#b8c7db] bg-white px-4 py-2 text-[14px] font-medium text-[#365077] transition hover:border-[#99b7df]"
          >
            Demo мэдээлэл
          </button>
          <Link
            href="/teacher"
            className="rounded-xl border border-[#b8c7db] bg-white px-4 py-2 text-[14px] font-medium text-[#365077] transition hover:border-[#99b7df]"
          >
            Багшийн хэсэг
          </Link>
        </div>
      </div>
    </main>
  );
}
