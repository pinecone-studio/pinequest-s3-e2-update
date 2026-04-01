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
  onCancel,
  onConfirm,
}: FinishConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/10 px-4 backdrop-blur-[8px]">
      <div className="h-[510px] w-full max-w-[768px] rounded-[28px] bg-[#edf6ff] px-10 py-12 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <Image
            src="/text.png"
            alt="Bee"
            width={160}
            height={120}
            priority
            className="h-[120px] w-auto object-contain"
          />

          <h4 className="mt-8 text-[28px] font-medium leading-[1.2] text-[#111111]">
            Шалгалтаа дуусгахдаа
            <br />
            итгэлтэй байна уу?
          </h4>

          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-[50px] min-w-[123px] items-center justify-center rounded-[20px] border border-[#29A4FF] bg-white px-8 py-3 text-[22px] font-medium text-[#29A4FF] transition hover:bg-[#f3f9ff]"
            >
              Буцах
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex h-[50px] min-w-[169px] items-center justify-center rounded-[20px] bg-[#349AF2] px-8 py-3 text-[22px] font-medium text-white transition hover:bg-[#2488e0]"
            >
              Тийм
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
