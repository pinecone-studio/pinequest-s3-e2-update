import { FileSpreadsheet, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { grades, subjects } from "../mock-data";
import type { Question } from "../types";
import { createEmptyQuestion, mockParsedQuestions, normalizeQuestionForType } from "../utils";
import { QuestionFormItem } from "./question-form-item";

export function CreateExamForm({
  onSave,
}: {
  onSave: (payload: { title: string; subject: string; grade: string; duration: number; questions: Question[] }) => void;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [grade, setGrade] = useState(grades[0]);
  const [duration, setDuration] = useState(40);
  const [questions, setQuestions] = useState<Question[]>([createEmptyQuestion()]);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [importType, setImportType] = useState<"pdf" | "excel">("pdf");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [builderMode, setBuilderMode] = useState<"import" | "manual">("import");
  const [importNote, setImportNote] = useState("");

  const addQuestion = () => {
    setQuestions((prev) => (prev.length >= 20 ? prev : [...prev, createEmptyQuestion()]));
  };

  const updateQuestion = (id: string, next: Question) => {
    setQuestions((prev) => prev.map((item) => (item.id === id ? normalizeQuestionForType(next) : item)));
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => (prev.length <= 1 ? prev : prev.filter((item) => item.id !== id)));
  };

  const addFromBank = (question: Question) => {
    setQuestions((prev) => {
      if (prev.length >= 20) return prev;
      return [
        ...prev,
        {
          ...question,
          id: `bank-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        },
      ];
    });
  };

  const resetForm = () => {
    setTitle("");
    setSubject(subjects[0]);
    setGrade(grades[0]);
    setDuration(40);
    setQuestions([createEmptyQuestion()]);
    setParsedQuestions([]);
    setSelectedFile(null);
    setImportNote("");
    setBuilderMode("import");
  };

  const handleSave = () => {
    const cleanQuestions = questions
      .map((q) => ({
        ...q,
        text: q.text.trim(),
        correctAnswer: q.correctAnswer.trim(),
        options: q.options.map((opt) => opt.trim()),
      }))
      .filter((q) => q.text.length > 0)
      .map((q) => normalizeQuestionForType(q));

    if (!title.trim() || cleanQuestions.length === 0) {
      return;
    }

    onSave({
      title: title.trim(),
      subject,
      grade,
      duration,
      questions: cleanQuestions,
    });

    resetForm();
  };

  return (
    <section className="space-y-3 rounded-2xl border border-[#d9e6fb] bg-white p-4 shadow-sm">
      <h2 className="text-4 font-bold text-[#1f2a44]">Шинэ шалгалт үүсгэх</h2>
      <p className="text-2 text-[#5c6f91]">
        Асуултаа гараар оруулаад хадгалахад зүүн талын шалгалтын жагсаалт руу автоматаар орно.
      </p>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <button
          className={
            "rounded-xl border px-3 py-2 text-2 font-semibold " +
            (builderMode === "import"
              ? "border-[#4f9dff] bg-[#eef6ff] text-[#2f73c4]"
              : "border-[#d9e6fb] bg-white text-[#1f2a44]")
          }
          onClick={() => setBuilderMode("import")}
          type="button"
        >
          1. PDF / Excel файл импортлох
        </button>
        <button
          className={
            "rounded-xl border px-3 py-2 text-2 font-semibold " +
            (builderMode === "manual"
              ? "border-[#4f9dff] bg-[#eef6ff] text-[#2f73c4]"
              : "border-[#d9e6fb] bg-white text-[#1f2a44]")
          }
          onClick={() => setBuilderMode("manual")}
          type="button"
        >
          2. Гараар асуулт үүсгэх
        </button>
      </div>

      {builderMode === "import" ? (
        <div className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
          <p className="text-2 font-semibold text-[#1f2a44]">Материал оруулах (PDF / Excel)</p>
          <p className="text-2 text-[#5c6f91]">
            Багшийн байгаа материал дээр тулгуурлан асуулт-хариулт үүсгээд асуултын санд хадгална.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              className={
                "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-2 " +
                (importType === "pdf"
                  ? "border-[#4f9dff] bg-[#eef6ff] text-[#2f73c4]"
                  : "border-[#d9e6fb] bg-white text-[#1f2a44]")
              }
              onClick={() => setImportType("pdf")}
              type="button"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
            <button
              className={
                "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-2 " +
                (importType === "excel"
                  ? "border-[#4f9dff] bg-[#eef6ff] text-[#2f73c4]"
                  : "border-[#d9e6fb] bg-white text-[#1f2a44]")
              }
              onClick={() => setImportType("excel")}
              type="button"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>
          </div>
          <div className="mt-2 space-y-2">
            <input
              accept={
                importType === "pdf"
                  ? ".pdf,application/pdf"
                  : ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              }
              className="w-full rounded-lg border border-[#d9e6fb] bg-white px-3 py-2 text-2 text-[#1f2a44] file:mr-2 file:rounded-md file:border-0 file:bg-[#eef6ff] file:px-3 file:py-1 file:text-2 file:font-semibold file:text-[#2f73c4]"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedFile(file);
                setImportNote("");
              }}
              type="file"
            />
            {selectedFile ? (
              <p className="text-2 text-[#5c6f91]">
                Сонгосон файл: {selectedFile.name} · {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            ) : (
              <p className="text-2 text-[#5c6f91]">Файл сонгоогүй байна.</p>
            )}
          </div>
          <div className="mt-2 flex flex-col gap-2 md:flex-row">
            <button
              className="rounded-lg bg-[#4f9dff] px-4 py-2 text-2 font-semibold text-white"
              onClick={() => {
                if (!selectedFile) {
                  setImportNote("Эхлээд файл сонгоно уу.");
                  return;
                }

                const fileName = selectedFile.name.toLowerCase();
                const isPdf = fileName.endsWith(".pdf");
                const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv");

                if (importType === "pdf" && !isPdf) {
                  setImportNote("PDF төрөл сонгосон тул .pdf файл оруулна уу.");
                  return;
                }

                if (importType === "excel" && !isExcel) {
                  setImportNote("Excel төрөл сонгосон тул .xlsx, .xls эсвэл .csv файл оруулна уу.");
                  return;
                }

                setParsedQuestions(
                  mockParsedQuestions({
                    importType,
                    subject,
                    grade,
                  }),
                );
                setImportNote("Файл амжилттай уншигдаж, асуултууд үүсгэлээ (mock parse).");
              }}
              type="button"
            >
              Шинжлэх
            </button>
            <button
              className="rounded-lg border border-[#d9e6fb] bg-white px-4 py-2 text-2 text-[#1f2a44]"
              onClick={() => {
                if (parsedQuestions.length === 0) return;
                setQuestionBank((prev) => [...parsedQuestions, ...prev]);
                setParsedQuestions([]);
                setImportNote("Импортолсон асуултууд сан руу хадгалагдлаа.");
                setBuilderMode("manual");
              }}
              type="button"
            >
              Асуултын санд хадгалаад үргэлжлүүлэх
            </button>
          </div>
          {importNote ? (
            <p className="text-2 text-[#2f73c4]">{importNote}</p>
          ) : null}
          {parsedQuestions.length > 0 ? (
            <div className="mt-2 space-y-2">
              {parsedQuestions.map((q, idx) => (
                <div className="rounded-lg border border-[#d9e6fb] bg-white p-2" key={q.id}>
                  <p className="text-2 font-semibold text-[#1f2a44]">
                    Шинжилсэн {idx + 1}. {q.text}
                  </p>
                  <p className="text-2 text-[#5c6f91]">
                    {q.type === "multiple_choice"
                      ? "Сонголттой"
                      : q.type === "short_answer"
                        ? "Богино хариулт"
                        : "Эсээ"}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {builderMode === "manual" && questionBank.length > 0 ? (
        <div className="rounded-xl border border-[#d9e6fb] bg-[#f7fbff] p-3">
          <p className="text-2 font-semibold text-[#1f2a44]">Асуултын сан (импортолсон)</p>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {questionBank.slice(0, 8).map((q) => (
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#d9e6fb] bg-white p-2"
                key={q.id}
              >
                <p className="text-2 text-[#1f2a44]">{q.text}</p>
                <button
                  className="rounded-lg border border-[#d9e6fb] bg-[#eef6ff] px-3 py-1 text-2 text-[#2f73c4]"
                  onClick={() => addFromBank(q)}
                  type="button"
                >
                  Шалгалтад нэмэх
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {builderMode === "manual" ? (
        <>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              className="h-10 rounded-xl border border-[#d9e6fb] px-3 text-2 text-[#1f2a44]"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Шалгалтын нэр"
              value={title}
            />
            <input
              className="h-10 rounded-xl border border-[#d9e6fb] px-3 text-2 text-[#1f2a44]"
              min={10}
              onChange={(e) => setDuration(Number(e.target.value) || 10)}
              placeholder="Хугацаа (минут)"
              type="number"
              value={duration}
            />
            <select className="h-10 rounded-xl border border-[#d9e6fb] px-3 text-2 text-[#1f2a44]" onChange={(e) => setSubject(e.target.value)} value={subject}>
              {subjects.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select className="h-10 rounded-xl border border-[#d9e6fb] px-3 text-2 text-[#1f2a44]" onChange={(e) => setGrade(e.target.value)} value={grade}>
              {grades.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {questions.map((question, index) => (
              <QuestionFormItem
                index={index}
                key={question.id}
                onChange={(next) => updateQuestion(question.id, next)}
                onRemove={() => removeQuestion(question.id)}
                question={question}
              />
            ))}
          </div>

          <div className="rounded-lg border border-[#d9e6fb] bg-[#f7fbff] px-3 py-2 text-2 text-[#5c6f91]">
            Одоогийн бөглөсөн асуулт: {questions.filter((q) => q.text.trim()).length}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-xl border border-[#d9e6fb] bg-[#f7fbff] px-3 py-2 text-2 font-semibold text-[#335c96]"
              onClick={addQuestion}
              type="button"
            >
              <Plus className="h-4 w-4" /> Асуулт нэмэх
            </button>
            <button
              className="rounded-xl bg-[#4f9dff] px-4 py-2 text-2 font-semibold text-white"
              onClick={handleSave}
              type="button"
            >
              Шалгалт хадгалах
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
