import { AlertTriangle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#dbe3f0] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff7ed]">
            <AlertTriangle className="h-6 w-6 text-[#f59e0b]" />
          </div>
          <div>
            <h4 className="text-5 font-bold text-[#1f2a44]">Шалгалтаа дуусгах уу?</h4>
            <p className="mt-1 text-3 text-[#5f7090]">
              Дуусгасны дараа хариултаа өөрчлөх боломжгүй.
            </p>
            <p className="mt-2 text-3 font-semibold text-[#334261]">
              Хариулсан: {answeredCount}/{total}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#dbe3f0] bg-white px-4 py-2 text-3 font-semibold text-[#445780] hover:bg-[#f6f9ff]"
          >
            Болих
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#1d4ed8] px-4 py-2 text-3 font-semibold text-white hover:bg-[#1b43bd]"
          >
            Тийм, дуусгах
          </button>
        </div>
      </div>
    </div>
  );
}
