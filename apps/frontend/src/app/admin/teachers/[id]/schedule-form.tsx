import { createTeacherExamSchedule } from "@/app/admin/action";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm";

const labelClass = "block text-xs font-medium text-zinc-600";

export function TeacherScheduleForm({ teacherId }: { teacherId: string }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-zinc-900">
          Шалгалтын хуваарь нэмэх
        </h2>
        <p className="text-xs text-zinc-500">
          Хэдэн оны хэдэн сарын хэдний өдөр, ямар сэдвээр, хэдэн цагаас шалгалт
          авахыг бүртгэнэ.
        </p>
      </div>

      <form
        action={createTeacherExamSchedule}
        className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <input type="hidden" name="teacherId" value={teacherId} />

        <label className={`${labelClass} xl:col-span-1`}>
          Сэдэв
          <input
            name="subject"
            required
            placeholder="Жишээ: Алгебр"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Өдөр
          <input name="examDate" type="date" required className={inputClass} />
        </label>

        <label className={labelClass}>
          Эхлэх цаг
          <input
            name="startTime"
            type="time"
            required
            className={inputClass}
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Хуваарь нэмэх
          </button>
        </div>
      </form>
    </section>
  );
}
