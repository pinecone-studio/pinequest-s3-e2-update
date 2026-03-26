"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DeleteExamScheduleDialog } from "./DeleteExamScheduleDialog";
import { TeacherExamScheduleForm } from "./TeacherExamScheduleForm";
import { TeacherExamScheduleList } from "./TeacherExamScheduleList";
import {
  deleteTeacherExamScheduleAction,
  saveTeacherExamScheduleAction,
} from "../_actions/exam-schedules";
import { getEmptyScheduleValues } from "../_utils/exam-schedule";
import type {
  TeacherExamSchedule,
  TeacherExamScheduleFormValues,
} from "../_types/exam-schedule";

type Props = {
  teacherId: string;
  schedules: TeacherExamSchedule[];
  classOptions: string[];
};

export function TeacherExamScheduleSection({
  teacherId,
  schedules,
  classOptions,
}: Props) {
  const router = useRouter();
  const defaultClass = classOptions[0] ?? "";
  const [values, setValues] = useState<TeacherExamScheduleFormValues>(
    getEmptyScheduleValues(teacherId, defaultClass),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<TeacherExamSchedule | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedSchedules = useMemo(() => schedules, [schedules]);

  function updateField(field: keyof TeacherExamScheduleFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setValues(getEmptyScheduleValues(teacherId, defaultClass));
    setFormError(null);
  }

  function handleEdit(schedule: TeacherExamSchedule) {
    setFormError(null);
    setValues({
      id: schedule.id,
      teacherId: schedule.teacherId,
      subject: schedule.subject,
      className: schedule.className,
      examDate: schedule.examDate,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
      notes: schedule.notes ?? "",
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    startTransition(async () => {
      const result = await saveTeacherExamScheduleAction(values);
      if (!result.ok) return setFormError(result.error ?? "Хадгалах үед алдаа гарлаа.");
      resetForm();
      router.refresh();
    });
  }

  function handleDeleteConfirm() {
    if (!selectedForDelete) return;
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteTeacherExamScheduleAction({
        id: selectedForDelete.id,
        teacherId,
      });
      if (!result.ok) return setDeleteError(result.error ?? "Устгах үед алдаа гарлаа.");
      setSelectedForDelete(null);
      router.refresh();
    });
  }

  return (
    <section className="space-y-5">
      <TeacherExamScheduleForm
        values={values}
        classOptions={classOptions}
        error={formError}
        isPending={isPending}
        onChange={updateField}
        onSubmit={handleSubmit}
        onCancelEdit={resetForm}
      />

      <TeacherExamScheduleList
        schedules={sortedSchedules}
        onEdit={handleEdit}
        onDelete={(schedule) => {
          setDeleteError(null);
          setSelectedForDelete(schedule);
        }}
      />

      <DeleteExamScheduleDialog
        schedule={selectedForDelete}
        isPending={isPending}
        error={deleteError}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          if (isPending) return;
          setSelectedForDelete(null);
          setDeleteError(null);
        }}
      />
    </section>
  );
}
