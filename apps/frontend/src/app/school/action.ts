"use server";

import { auth } from "@clerk/nextjs/server";
import { print } from "graphql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authSignInHref } from "@/app/lib/auth-redirect";
import { schoolGraphql } from "@/app/school/_lib/school-graphql-server";
import {
  DELETE_CLASS_MUTATION,
  DELETE_STUDENT_MUTATION,
  SYNC_CLASS_TEACHER_ASSIGNMENTS,
  UPDATE_STUDENT_MUTATION,
} from "@/graphql/typeDefs/mutations";

async function requireClerkId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect(authSignInHref("/school"));
  return userId;
}

export async function assignTeachersToClass(formData: FormData): Promise<void> {
  await requireClerkId();
  const classId = String(formData.get("classId") ?? "");
  const teacherIds = formData
    .getAll("teacherIds")
    .map((v) => String(v).trim())
    .filter(Boolean);
  if (!classId) return;

  await schoolGraphql<{ syncClassTeacherAssignments: boolean }>(
    print(SYNC_CLASS_TEACHER_ASSIGNMENTS),
    { input: { classId, teacherIds } },
  );

  revalidatePath("/school");
  revalidatePath("/school/classes");
  revalidatePath(`/school/classes/${classId}`);
  revalidatePath("/teacher");
}

export async function deleteClass(formData: FormData): Promise<void> {
  await requireClerkId();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await schoolGraphql<{ deleteClass: boolean }>(print(DELETE_CLASS_MUTATION), {
    id,
  });

  revalidatePath("/school");
  revalidatePath("/school/classes");
  redirect("/school/classes");
}

export async function updateStudent(formData: FormData): Promise<void> {
  await requireClerkId();
  const id = String(formData.get("id") ?? "");
  const studentCode = String(formData.get("studentNumber") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const classId = String(formData.get("classId") ?? "");
  if (!id) return;

  await schoolGraphql<{ updateStudent: { classId: string } }>(
    print(UPDATE_STUDENT_MUTATION),
    {
      input: {
        id,
        classId: classId || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        studentCode: studentCode || undefined,
      },
    },
  );

  revalidatePath("/school");
  revalidatePath("/school/classes");
  revalidatePath(`/school/classes/${classId}`);
  revalidatePath("/school/students");
  revalidatePath("/teacher");
}

export async function removeStudent(formData: FormData): Promise<void> {
  await requireClerkId();
  const id = String(formData.get("id") ?? "");
  const classId = String(formData.get("classId") ?? "");
  if (!id) return;

  await schoolGraphql<{ deleteStudent: boolean }>(
    print(DELETE_STUDENT_MUTATION),
    { id },
  );

  revalidatePath("/school");
  revalidatePath("/school/classes");
  if (classId) revalidatePath(`/school/classes/${classId}`);
  revalidatePath("/school/students");
  revalidatePath("/teacher");
}
