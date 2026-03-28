"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/app/lib/session";
import { store } from "@/app/lib/store";
import { examSchedulesMock } from "../_mock/exam-schedules";
import { validateSchedule } from "../_utils/exam-schedule";
import type {
  ScheduleActionResult,
  TeacherExamScheduleFormValues,
} from "../_types/exam-schedule";

const DEFAULT_ADMIN_ID = "user-admin";

async function requireAdmin() {
  const sessionUser = await getSessionUser();
  if (sessionUser?.role === "school_admin") return sessionUser;
  return store.getUser(DEFAULT_ADMIN_ID)!;
}

export async function saveTeacherExamScheduleAction(
  values: TeacherExamScheduleFormValues,
): Promise<ScheduleActionResult> {
  await requireAdmin();
  const allSchedules = examSchedulesMock.listAll();
  const error = validateSchedule(values, allSchedules, values.id);
  if (error) return { ok: false, error };

  if (values.id) {
    const updated = examSchedulesMock.update(values.id, values);
    if (!updated) return { ok: false, error: "Засах шалгалтын хуваарь олдсонгүй." };
  } else {
    examSchedulesMock.create(values);
  }

  revalidatePath("/school/teachers");
  revalidatePath(`/school/teachers/${values.teacherId}`);
  return { ok: true };
}

export async function deleteTeacherExamScheduleAction(input: {
  id: string;
  teacherId: string;
}): Promise<ScheduleActionResult> {
  await requireAdmin();
  if (!input.id) return { ok: false, error: "Устгах хуваарь олдсонгүй." };
  const removed = examSchedulesMock.remove(input.id);
  if (!removed) return { ok: false, error: "Шалгалтын хуваарь устгагдсан байна." };
  revalidatePath("/school/teachers");
  revalidatePath(`/school/teachers/${input.teacherId}`);
  return { ok: true };
}
