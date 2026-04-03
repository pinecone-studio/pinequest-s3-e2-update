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
  UPDATE_CLASS_MUTATION,
  UPDATE_STUDENT_MUTATION,
} from "@/graphql/typeDefs/mutations";

async function requireClerkId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect(authSignInHref("/school"));
  return userId;
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

export async function updateClassInfo(formData: FormData): Promise<void> {
  await requireClerkId();
  const id = String(formData.get("id") ?? "");
  const gradeRaw = String(formData.get("grade") ?? "").trim();
  const section = String(formData.get("section") ?? "").trim().toUpperCase();
  const sectionTeacherId = String(formData.get("sectionTeacherId") ?? "").trim();
  if (!id) return;

  const grade = Number.parseInt(gradeRaw, 10);
  if (!Number.isFinite(grade) || grade <= 0) {
    throw new Error("Анги (тоо) зөв оруулна уу.");
  }
  if (!section) {
    throw new Error("Бүлэг оруулна уу.");
  }
  if (!sectionTeacherId) {
    throw new Error("Анги даасан багш сонгоно уу.");
  }

  await schoolGraphql<{ updateClass: { id: string } }>(
    print(UPDATE_CLASS_MUTATION),
    {
      input: {
        id,
        grade,
        section,
        sectionTeacherId,
      },
    },
  );

  revalidatePath("/school");
  revalidatePath("/school/classes");
  revalidatePath(`/school/classes/${id}`);
  revalidatePath("/teacher");
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
