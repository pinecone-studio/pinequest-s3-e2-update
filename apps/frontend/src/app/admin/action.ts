"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authSignInHref } from "@/app/lib/auth-redirect";
import { store } from "@/app/lib/store";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect(authSignInHref("/admin"));
}

export async function createTeacher(formData: FormData): Promise<void> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "");
  const specialty = String(formData.get("specialty") ?? "").trim();
  if (!name) return;
  store.createTeacher(name, email || undefined, specialty || undefined);
  revalidatePath("/admin");
  revalidatePath("/admin/teachers");
}

export async function updateTeacher(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const specialty = String(formData.get("specialty") ?? "");
  if (!id || !name || !email) return;
  store.updateTeacher(id, name, email, specialty);
  revalidatePath("/admin");
  revalidatePath("/admin/teachers");
}

export async function removeTeacher(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  store.deleteTeacher(id);
  revalidatePath("/admin");
  revalidatePath("/admin/teachers");
  revalidatePath("/admin/classes");
}

export async function createClass(formData: FormData): Promise<void> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  store.createClass(name);
  revalidatePath("/admin");
  revalidatePath("/admin/classes");
}

export async function updateClass(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  if (!store.updateClassName(id, name)) return;
  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath(`/admin/classes/${id}`);
}

export async function deleteClass(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) store.deleteClass(id);
  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  redirect("/admin/classes");
}

export async function assignTeachersToClass(formData: FormData): Promise<void> {
  await requireAdmin();
  const classId = String(formData.get("classId") ?? "");
  const teacherIds = formData
    .getAll("teacherIds")
    .map((v) => String(v).trim())
    .filter(Boolean);
  if (!classId) return;
  store.setClassTeachers(classId, teacherIds);
  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath(`/admin/classes/${classId}`);
  revalidatePath("/teacher");
}

export async function addStudent(formData: FormData): Promise<void> {
  await requireAdmin();
  const classId = String(formData.get("classId") ?? "");
  const studentNumber = String(formData.get("studentNumber") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  if (!classId || !studentNumber || !firstName || !lastName) return;
  const newId = store.addStudent(classId, {
    studentNumber,
    firstName,
    lastName,
  });
  if (!newId) return;
  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath(`/admin/classes/${classId}`);
  revalidatePath("/teacher");
  revalidatePath(`/teacher/classes/${classId}`);
}

export async function updateStudent(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const studentNumber = String(formData.get("studentNumber") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const classId = String(formData.get("classId") ?? "");
  if (!id) return;
  store.updateStudent(id, { studentNumber, firstName, lastName, classId });
  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath(`/admin/classes/${classId}`);
  revalidatePath("/teacher");
}

export async function removeStudent(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const classId = String(formData.get("classId") ?? "");
  if (!id) return;
  store.removeStudent(id);
  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  if (classId) revalidatePath(`/admin/classes/${classId}`);
  revalidatePath("/teacher");
}
