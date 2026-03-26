import { Trash2 } from "lucide-react";
import type { Question, QuestionType } from "../types";
import { questionTypeLabel } from "../utils";

export function QuestionFormItem({
  index,
  question,
  onChange,
  onRemove,
}: {
  index: number;
  question: Question;
  onChange: (next: Question) => void;
  onRemove: () => void;
}) {
  const updateType = (type: QuestionType) => {
    if (type === "multiple_choice") {
      onChange({ ...question, type, options: question.options.length > 0 ? question.options : ["", "", "", ""] });
      return;
    }
    onChange({ ...question, type, options: [] });
  };

  return (
    <div className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-4 font-bold text-[#1f2a44]">Асуулт {index + 1}</p>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-[#ff6b6b]/40 bg-[#ff6b6b]/10 px-2 py-1 text-2 text-[#b94949]"
          onClick={onRemove}
          type="button"
        >
          <Trash2 className="h-3.5 w-3.5" /> Устгах
        </button>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <div>
          <p className="mb-1 text-2 text-[#5c6f91]">Төрөл: асуултын хариултын формат</p>
          <select
            className="h-10 w-full rounded-lg border border-[#d9e6fb] bg-white px-2 text-2 text-[#1f2a44]"
            onChange={(e) => updateType(e.target.value as QuestionType)}
            value={question.type}
          >
            <option value="multiple_choice">{questionTypeLabel("multiple_choice")}</option>
            <option value="short_answer">{questionTypeLabel("short_answer")}</option>
            <option value="essay">{questionTypeLabel("essay")}</option>
          </select>
        </div>
        <div>
          <p className="mb-1 text-2 text-[#5c6f91]">Оноо: энэ асуултын авах дээд оноо</p>
          <input
            className="h-10 w-full rounded-lg border border-[#d9e6fb] bg-white px-2 text-2 text-[#1f2a44]"
            min={1}
            onChange={(e) => onChange({ ...question, score: Number(e.target.value) || 1 })}
            placeholder="Оноо"
            type="number"
            value={question.score}
          />
        </div>
        <div>
          <p className="mb-1 text-2 text-[#5c6f91]">Зөв хариулт: шалгахад ашиглах жишиг хариу</p>
          <input
            className="h-10 w-full rounded-lg border border-[#d9e6fb] bg-white px-2 text-2 text-[#1f2a44]"
            onChange={(e) => onChange({ ...question, correctAnswer: e.target.value })}
            placeholder="Зөв хариулт"
            value={question.correctAnswer}
          />
        </div>
      </div>

      <p className="mb-1 mt-2 text-2 text-[#5c6f91]">Асуултын текст: сурагчид харагдах үндсэн асуулт</p>
      <textarea
        className="min-h-20 w-full rounded-lg border border-[#d9e6fb] bg-white px-2 py-2 text-2 text-[#1f2a44]"
        onChange={(e) => onChange({ ...question, text: e.target.value })}
        placeholder="Асуултын текст"
        value={question.text}
      />

      {question.type === "multiple_choice" && (
        <div className="mt-2">
          <p className="mb-1 text-2 text-[#5c6f91]">Сонголтууд: A, B, C, D хувилбарууд</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {[0, 1, 2, 3].map((idx) => (
            <input
              className="h-10 rounded-lg border border-[#d9e6fb] bg-white px-2 text-2 text-[#1f2a44]"
              key={idx}
              onChange={(e) => {
                const nextOptions = [...question.options];
                nextOptions[idx] = e.target.value;
                onChange({ ...question, options: nextOptions });
              }}
              placeholder={`${String.fromCharCode(65 + idx)} сонголт`}
              value={question.options[idx] ?? ""}
            />
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
