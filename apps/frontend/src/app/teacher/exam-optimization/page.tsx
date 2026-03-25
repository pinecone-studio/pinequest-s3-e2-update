"use client";

import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { FileText, Sparkles, Upload } from "lucide-react";

const EASY_POINTS = 1;
const MEDIUM_POINTS = 2;
const HARD_POINTS = 3;

function clampInt(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.floor(Number.isFinite(value) ? value : min)));
}

export default function ExamOptimizationPage() {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [easyCount, setEasyCount] = useState(10);
  const [mediumCount, setMediumCount] = useState(8);
  const [hardCount, setHardCount] = useState(3);
  const [variantCount, setVariantCount] = useState(2);

  const [schoolName, setSchoolName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);

  const totalQuestions = easyCount + mediumCount + hardCount;
  const totalPoints =
    easyCount * EASY_POINTS +
    mediumCount * MEDIUM_POINTS +
    hardCount * HARD_POINTS;

  const assignPdf = useCallback((file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") return;
    setPdfFile(file);
  }, []);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    assignPdf(e.target.files?.[0]);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    assignPdf(e.dataTransfer.files?.[0]);
  };

  const variantLabel = useMemo(() => {
    const n = variantCount;
    if (n === 1) return "1 вариант";
    return `${n} вариант`;
  }, [variantCount]);

  return (
    <section className="px-6 py-8 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="text-center sm:text-left">
          <h1 className="text-5 font-extrabold text-[#1f2a44] sm:text-8">
            Шалгалтын вариант үүсгэгч
          </h1>
          <p className="mt-3 text-3 leading-relaxed text-[#66789f]">
            PDF агуулгаас {variantLabel} үүсгэнэ. Асуултын тоо, түвшин, оноог
            доор тохируулна уу.
          </p>
        </header>

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed bg-white p-10 text-center shadow-sm transition ${
            isDragging
              ? "border-teal-600 bg-teal-50"
              : "border-[#c8d4e6] hover:border-[#9eb8e0]"
          }`}
        >
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={onFileChange}
          />
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <FileText className="h-9 w-9" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-5 font-bold text-[#1f2a44]">
                PDF файлаа энд оруулна уу
              </p>
              <p className="mt-2 text-3 text-[#66789f]">
                Хичээлийн агуулга, сурах бичиг, лекцийн материал
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-4 font-semibold text-white transition hover:bg-teal-800"
            >
              <Upload className="h-4 w-4" />
              Файл сонгох
            </button>
            {pdfFile ? (
              <p className="text-3 font-medium text-teal-600">
                Сонгогдсон: {pdfFile.name}
              </p>
            ) : null}
          </div>
        </div>

        <section>
          <h2 className="mb-5 text-5 font-extrabold text-[#1f2a44]">
            Асуултын тохиргоо
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            <DifficultyCard
              title="Хялбар"
              dotClass="bg-emerald-500"
              points={EASY_POINTS}
              value={easyCount}
              onChange={(v) => setEasyCount(clampInt(v, 0, 200))}
            />
            <DifficultyCard
              title="Дунд"
              dotClass="bg-amber-400"
              points={MEDIUM_POINTS}
              value={mediumCount}
              onChange={(v) => setMediumCount(clampInt(v, 0, 200))}
            />
            <DifficultyCard
              title="Хэцүү"
              dotClass="bg-red-500"
              points={HARD_POINTS}
              value={hardCount}
              onChange={(v) => setHardCount(clampInt(v, 0, 200))}
            />
          </div>
        </section>

        <div className="flex flex-wrap items-stretch justify-between gap-4 rounded-2xl border border-[#d9dee8] bg-[#f8fafc] px-6 py-5 shadow-sm">
          <SummaryItem label="Асуулт" value={String(totalQuestions)} />
          <SummaryItem label="Нийт оноо" value={String(totalPoints)} />
          <div className="flex min-w-[140px] flex-1 flex-col justify-center gap-2 sm:flex-none">
            <span className="text-3 font-semibold uppercase tracking-wide text-[#66789f]">
              Вариант
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={variantCount}
              onChange={(e) =>
                setVariantCount(clampInt(Number(e.target.value), 1, 20))
              }
              className="w-full max-w-[120px] rounded-xl border border-[#d9dee8] bg-white px-4 py-2.5 text-5 font-bold text-[#1f2a44] outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Хичээлийн нэр"
            placeholder="Жишээ: Математик"
            value={subjectName}
            onChange={setSubjectName}
          />
          <Field
            label="Анги / бүлэг"
            placeholder="Жишээ: 10А анги"
            value={classGroup}
            onChange={setClassGroup}
          />
          <Field
            label="Хугацаа (минут)"
            type="number"
            min={1}
            max={300}
            value={String(durationMinutes)}
            onChange={(v) => setDurationMinutes(clampInt(Number(v), 1, 300))}
          />
        </div>

        <div className="flex justify-center pb-4">
          <button
            type="button"
            disabled={!pdfFile || totalQuestions < 1}
            className="inline-flex items-center gap-3 rounded-2xl bg-teal-600 px-10 py-4 text-5 font-bold text-white shadow-md transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Sparkles className="h-6 w-6" />
            Вариант үүсгэх
          </button>
        </div>
      </div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-[120px] flex-1 flex-col justify-center gap-1">
      <span className="text-3 font-semibold uppercase tracking-wide text-[#66789f]">
        {label}
      </span>
      <span className="text-5 font-extrabold text-[#1f2a44]">{value}</span>
    </div>
  );
}

function DifficultyCard({
  title,
  dotClass,
  points,
  value,
  onChange,
}: {
  title: string;
  dotClass: string;
  points: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#d9dee8] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />
        <h3 className="text-5 font-bold text-[#1f2a44]">{title}</h3>
      </div>
      <p className="mt-2 text-3 font-medium text-[#66789f]">{points} оноо</p>
      <label className="mt-5 block">
        <span className="text-3 font-semibold text-[#50607f]">
          Асуултын тоо
        </span>
        <input
          type="number"
          min={0}
          max={200}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border border-[#d9dee8] bg-[#fafbfc] px-4 py-3 text-5 font-semibold text-[#1f2a44] outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/25"
        />
      </label>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  min,
  max,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="text-3 font-semibold uppercase tracking-wide text-[#66789f]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[#d9dee8] bg-white px-4 py-3 text-4 text-[#1f2a44] outline-none transition placeholder:text-[#a0aec8] focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25"
      />
    </label>
  );
}
