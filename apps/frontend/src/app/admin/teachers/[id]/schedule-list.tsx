import { removeTeacherExamSchedule } from "@/app/admin/action";
import type { TeacherExamSchedule } from "@/app/lib/teacher_exam_schedule_store";

function formatExamDate(date: string) {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${year} оны ${month} сарын ${day}-ны өдөр`;
}

export function TeacherScheduleList({
  schedules,
}: {
  schedules: TeacherExamSchedule[];
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-6 py-4">
        <h2 className="text-sm font-semibold text-zinc-900">
          Шалгалтын хуваарь ({schedules.length})
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Багшийн товлосон шалгалтуудыг огноо, цагийн дарааллаар харуулна.
        </p>
      </div>

      {schedules.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-zinc-500">
          Одоогоор шалгалтын хуваарь алга.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {schedules.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-base font-semibold text-zinc-900">
                  {item.subject}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  {formatExamDate(item.examDate)} · {item.startTime}-аас
                </p>
              </div>

              <form action={removeTeacherExamSchedule}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="teacherId" value={item.teacherId} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  Устгах
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
