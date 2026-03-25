import { TeacherExamScheduleCard } from "./TeacherExamScheduleCard";
import type { TeacherExamSchedule } from "../_types/exam-schedule";

type Props = {
  schedules: TeacherExamSchedule[];
  onEdit: (schedule: TeacherExamSchedule) => void;
  onDelete: (schedule: TeacherExamSchedule) => void;
};

export function TeacherExamScheduleList({ schedules, onEdit, onDelete }: Props) {
  if (schedules.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
        <h3 className="text-base font-semibold text-zinc-900">Шалгалтын хуваарь алга</h3>
        <p className="mt-2 text-sm text-zinc-500">
          Энэ багшид анхны шалгалтын товоо үүсгээд хяналттайгаар удирдаж эхлээрэй.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {schedules.map((schedule) => (
        <TeacherExamScheduleCard
          key={schedule.id}
          schedule={schedule}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
