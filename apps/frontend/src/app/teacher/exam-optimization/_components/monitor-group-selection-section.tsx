"use client";

import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import type { MonitorExamCardItem } from "../_lib/monitoring";

export function MonitorGroupSelectionSection({
  exam,
  grantingClassId,
  onBack,
  onGrantAccess,
  onOpenGroup,
}: {
  exam: MonitorExamCardItem;
  grantingClassId: string | null;
  onBack: () => void;
  onGrantAccess: (classId: string) => void;
  onOpenGroup: (classId: string) => void;
}) {
  const allowedSet = new Set(exam.allowedClassIds);

  return (
    <section className="space-y-6">
      <div className="rounded-[12px] border border-[#d4d4d8] bg-[#FAFAFA] px-8 py-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-[1.2] text-[#1f2a44]">
              Анги сонгох
            </h2>
            <p className="mt-1 text-3 text-[#737373]">
              Эхлээд ангид эрх нээнэ, дараа нь тухайн ангийн хяналт руу орно.
            </p>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-full border border-[#d7e2f1] bg-white px-4 py-2 text-3 font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
            {exam.subject}
          </span>
          <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
            {exam.questionCount} асуулт
          </span>
          <span className="rounded-[8px] bg-[#d7ebff] px-4 py-1.5 text-[12px] font-medium text-[#355389]">
            {exam.totalPoints} оноо
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exam.classOptions.length === 0 ? (
            <div className="col-span-full rounded-[16px] border border-dashed border-[#c5d4e8] bg-[#f4f8ff] px-5 py-8 text-center text-sm text-[#5c6786]">
              Танд хамаарах анги бүртгэгдээгүй эсвэл өгөгдөл ачааллаагүй байна.
              Сургуулийн админтай холбогдоно уу.
            </div>
          ) : (
            exam.classOptions.map((group) => {
              const allowed = allowedSet.has(group.id);
              const granting = grantingClassId === group.id;

              return (
                <div
                  className="rounded-[20px] border border-[#d9dee8] bg-white p-5 shadow-sm"
                  key={group.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[24px] font-semibold text-[#1f2a44]">
                        {group.label}
                      </p>
                      <p className="mt-2 text-[14px] text-[#66789f]">
                        {allowed
                          ? "Эрх нээгдсэн — хяналт руу орж болно."
                          : "Эрх хараахан нээгдээгүй — эхлээд «Эрх нээх» дарна."}
                      </p>
                    </div>
                    {!allowed ? (
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8d4a8] bg-[#fff8e7]">
                        <Lock className="h-4 w-4 text-[#8a6d3b]" />
                      </span>
                    ) : (
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#cfe8c9] bg-[#f4fff0]">
                        <ArrowRight className="h-4 w-4 text-[#357a3d]" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {allowed ? (
                      <button
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#39a8ff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2198f5]"
                        onClick={() => onOpenGroup(group.id)}
                        type="button"
                      >
                        Хяналт руу орох
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#aac8f8] bg-white px-4 py-2.5 text-sm font-semibold text-[#1f6feb] transition hover:bg-[#eef6ff] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={Boolean(grantingClassId)}
                        onClick={() => {
                          void onGrantAccess(group.id);
                        }}
                        type="button"
                      >
                        {granting ? "Нээгдэж байна…" : "Эрх нээх"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
