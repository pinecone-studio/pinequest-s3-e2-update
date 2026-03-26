import type { ReactNode } from "react";
import { ExamStepper, type WizardStepKey } from "./ExamStepper";

export function TeacherExamWizardShell({
  step,
  title,
  subtitle,
  children,
  rightSlot,
}: {
  step: WizardStepKey;
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
}) {
  const stripLabel =
    step === "upload" ? "Эх файл ба асуулт бэлэн" : step === "setup" ? "Анги сонгогдсон" : "Илгээхэд бэлэн";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#d9e6fb] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-[#1f2a44]">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-[#5c6f91]">{subtitle}</p> : null}
          </div>
          <div className="md:pt-1">{rightSlot}</div>
        </div>
        <div className="mt-4">
          <ExamStepper activeKey={step} />
        </div>
        <div className="mt-4 rounded-2xl border border-[#e6edf8] bg-[#f7fbff] p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-extrabold text-[#2f73c4]">Товч сануулга</p>
              <p className="mt-1 text-[#5c6f91]">
                Сурагчид <span className="font-extrabold">нэг линк</span> ашиглана. Систем сурагч бүрт оноогдсон өөр дараалал, өөр сонголтын дарааллыг{" "}
                <span className="font-extrabold">автоматаар</span> тохируулна — та тохиргоо хийх шаардлагагүй.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#d9e6fb] bg-white px-3 py-1 text-xs font-semibold text-[#5c6f91]">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {stripLabel}
            </div>
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
