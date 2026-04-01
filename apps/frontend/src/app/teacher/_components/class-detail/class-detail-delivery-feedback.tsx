type ClassDetailDeliveryFeedbackProps = {
  message: string;
};

export function ClassDetailDeliveryFeedback({
  message,
}: ClassDetailDeliveryFeedbackProps) {
  const isWarning = message.includes("дор хаяж");
  return (
    <div
      className={`rounded-2xl border px-5 py-4 text-sm font-medium ${
        isWarning
          ? "border-[#ffd7d7] bg-[#fff5f5] text-[#122459]"
          : "border-[#cfe0fb] bg-[#eef6ff] text-[#122459]"
      }`}
    >
      {message}
    </div>
  );
}
