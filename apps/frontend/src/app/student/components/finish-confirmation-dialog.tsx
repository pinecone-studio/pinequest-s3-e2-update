import Image from "next/image";

type FinishConfirmationDialogProps = {
  isOpen: boolean;
  answeredCount: number;
  total: number;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
};

export function FinishConfirmationDialog({
  isOpen,
  answeredCount,
  total,
  onCancel,
  onConfirm,
  isSubmitting = false,
  submitError = null,
}: FinishConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Диалог хаах"
        className="absolute inset-0 bg-[#0f172a]/25 backdrop-blur-[6px] sm:bg-[#0f172a]/10 sm:backdrop-blur-sm"
        disabled={isSubmitting}
        onClick={onCancel}
      />

      <div
        className="relative z-10 flex max-h-[min(80dvh,30rem)] w-[min(calc(100vw-2rem),22rem)] flex-col overflow-hidden rounded-[18px] border border-[#cfe3f5] bg-[#edf6ff] pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_40px_rgba(15,23,42,0.12)] sm:max-h-[min(90dvh,36rem)] sm:w-full sm:max-w-lg sm:rounded-[28px] sm:border sm:shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-exam-dialog-title"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-6 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-8 sm:pt-8 md:px-10 md:pt-10">
          <div className="mx-auto flex min-h-0 w-full max-w-md flex-col items-center pb-2 text-center">
            <Image
              src="/text.png"
              alt=""
              width={160}
              height={120}
              priority
              className="h-18 w-auto max-w-[min(12rem,72vw)] object-contain sm:h-25 md:h-30"
            />

            <h4
              id="finish-exam-dialog-title"
              className="mt-5 w-full text-pretty text-[1.125rem] font-medium leading-snug text-[#111111] sm:mt-7 sm:text-2xl sm:leading-snug md:mt-8 md:text-[28px] md:leading-[1.2]"
            >
              Шалгалтаа дуусгахдаа итгэлтэй байна уу?
            </h4>

            <p className="mt-3 text-sm text-[#5c6786] sm:text-base">
              {answeredCount}/{total} асуултад хариулсан
            </p>

            {submitError ? (
              <p className="mt-3 w-full text-left text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 md:mt-10">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onCancel}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-[20px] border border-[#29A4FF] bg-white px-4 py-2 text-base font-medium text-[#29A4FF] transition hover:bg-[#f3f9ff] active:scale-[0.99] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11.5 sm:px-5 sm:text-base md:text-[20px]"
              >
                Буцах
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onConfirm}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-[20px] bg-[#349AF2] px-4 py-2 text-base font-medium text-white transition hover:bg-[#2488e0] active:scale-[0.99] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-11.5 sm:px-5 sm:text-base md:text-[20px]"
              >
                {isSubmitting ? "Илгээж байна…" : "Тийм"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
