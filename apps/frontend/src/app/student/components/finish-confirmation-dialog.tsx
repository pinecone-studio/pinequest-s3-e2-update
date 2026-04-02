import Image from "next/image";

type FinishConfirmationDialogProps = {
  isOpen: boolean;
  answeredCount: number;
  total: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function FinishConfirmationDialog({
  isOpen,
  answeredCount,
  total,
  onCancel,
  onConfirm,
}: FinishConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Диалог хаах"
        className="absolute inset-0 bg-[#0f172a]/25 backdrop-blur-[6px] sm:bg-[#0f172a]/10 sm:backdrop-blur-[8px]"
        onClick={onCancel}
      />

      <div
        className="relative z-10 flex max-h-[min(88dvh,34rem)] w-full max-w-[768px] flex-col overflow-hidden rounded-t-[22px] border border-b-0 border-[#cfe3f5] bg-[#edf6ff] shadow-[0_-8px_40px_rgba(15,23,42,0.12)] sm:max-h-[min(90dvh,36rem)] sm:rounded-[28px] sm:border sm:shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
        style={{
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-exam-dialog-title"
      >
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-6 sm:px-8 sm:pt-8 md:px-10 md:pt-10"
          style={{
            paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
            paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
          }}
        >
          <div className="flex min-h-0 flex-col items-center pb-2 text-center">
            <Image
              src="/text.png"
              alt=""
              width={160}
              height={120}
              priority
              className="h-[4.5rem] w-auto max-w-[min(12rem,72vw)] object-contain sm:h-[100px] md:h-[120px]"
            />

            <h4
              id="finish-exam-dialog-title"
              className="mt-5 max-w-md text-pretty text-[1.125rem] font-medium leading-snug text-[#111111] sm:mt-7 sm:text-2xl sm:leading-snug md:mt-8 md:text-[28px] md:leading-[1.2]"
            >
              Шалгалтаа дуусгахдаа итгэлтэй байна уу?
            </h4>

            <p className="mt-3 text-sm text-[#5c6786] sm:text-base">
              {answeredCount}/{total} асуултад хариулсан
            </p>

            <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:mt-8 sm:max-w-md sm:flex-row sm:items-stretch sm:justify-center sm:gap-4 md:mt-10">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-[20px] border border-[#29A4FF] bg-white px-5 py-3 text-base font-medium text-[#29A4FF] transition hover:bg-[#f3f9ff] active:scale-[0.99] sm:min-h-[50px] sm:flex-1 sm:px-8 sm:text-lg md:flex-none md:min-w-[8.5rem] md:text-[22px]"
              >
                Буцах
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-[20px] bg-[#349AF2] px-5 py-3 text-base font-medium text-white transition hover:bg-[#2488e0] active:scale-[0.99] sm:min-h-[50px] sm:flex-1 sm:px-8 sm:text-lg md:flex-none md:min-w-[10.5rem] md:text-[22px]"
              >
                Тийм
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
