"use server";

import { redirect } from "next/navigation";
import { setSession } from "@/app/lib/session";
import { store } from "@/app/lib/store";

/** Демо: нэг товчоор нэвтрэх багшийн ID (saraa@demo.mn) */
const DEMO_TEACHER_ID = "user-teacher-1";

export async function loginTeacherInstant(): Promise<void> {
  const user = store.getUser(DEMO_TEACHER_ID);
  if (!user || user.role !== "teacher") {
    redirect("/?error=login");
  }
  await setSession(user.id);
  redirect("/teacher");
}
