import { AlertTriangle, FileText } from "lucide-react";
import type { ExamDetailAlert } from "../_types/exam";

type ExamAlertsProps = {
  notes: ExamDetailAlert[];
};

export function ExamAlerts({ notes }: ExamAlertsProps) {
  return (
    <section className="rounded-3xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-3 font-semibold text-[#0f172a]">
          Анхааруулга / note
        </h2>
        <p className="mt-1 text-2 text-[#61708a]">
          Шалгалтыг эхлүүлэх, хянах, үнэлэхтэй холбоотой ажиглалт болон
          сануулгууд.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2 font-semibold text-[#0f172a]">
              Анхаарах тэмдэглэл
            </p>
            <ul className="mt-3 space-y-2">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="flex items-start gap-2 text-2 text-[#5c6d87]"
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#c07a12]" />
                  <span>{note.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
