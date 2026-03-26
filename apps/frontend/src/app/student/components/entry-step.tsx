type EntryStepProps = {
  studentLastName: string;
  studentFirstName: string;
  studentEmail: string;
  classCode: string;
  canProceed: boolean;
  onChangeLastName: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeClassCode: (value: string) => void;
  onProceed: () => void;
};

export function EntryStep({
  studentLastName,
  studentFirstName,
  studentEmail,
  classCode,
  canProceed,
  onChangeLastName,
  onChangeFirstName,
  onChangeEmail,
  onChangeClassCode,
  onProceed,
}: EntryStepProps) {
  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-10 text-[#1f2a44]">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#dbe3f0] bg-white p-8 shadow-[0_14px_40px_rgba(27,39,80,0.08)]">
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-3 font-semibold text-[#405173]">
              Овог <span className="text-[#ef4444]">*</span>
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-[#dbe3f0] bg-white px-4 py-3 text-3 outline-none transition focus:border-[#3b82f6]"
              placeholder="Түвшин"
              value={studentLastName}
              onChange={(event) => onChangeLastName(event.target.value)}
            />
          </div>
          <div>
            <label className="text-3 font-semibold text-[#405173]">
              Нэр <span className="text-[#ef4444]">*</span>
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-[#dbe3f0] bg-white px-4 py-3 text-3 outline-none transition focus:border-[#3b82f6]"
              placeholder="Элзий-Орших"
              value={studentFirstName}
              onChange={(event) => onChangeFirstName(event.target.value)}
            />
          </div>
          <div>
            <label className="text-3 font-semibold text-[#405173]">
              И-мэйл <span className="text-[#ef4444]">*</span>
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-[#dbe3f0] bg-white px-4 py-3 text-3 outline-none transition focus:border-[#3b82f6]"
              placeholder="student@school.mn"
              type="email"
              value={studentEmail}
              onChange={(event) => onChangeEmail(event.target.value)}
            />
          </div>
          <div>
            <label className="text-3 font-semibold text-[#405173]">
              Ангийн код (заавал биш)
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-[#dbe3f0] bg-white px-4 py-3 text-3 outline-none transition focus:border-[#3b82f6]"
              placeholder="8A"
              value={classCode}
              onChange={(event) => onChangeClassCode(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={!canProceed}
            onClick={onProceed}
            className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-3 font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-[#9dbaf6]"
          >
            Дараагийн алхам
          </button>
        </div>
      </div>
    </main>
  );
}
