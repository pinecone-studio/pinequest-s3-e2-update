/** @format */

"use client";

import { useMutation } from "@apollo/client/react";
import { useEffect, useRef } from "react";
import { LINK_TEACHER_CLERK } from "@/graphql/typeDefs/mutations";

/**
 * Сургуулийн админ `addTeacher`-ээр урьсан багш: ижил и-мэйлээр Clerk-ээр нэвтрэхэд
 * энэ mutation нэг удаа амжилттай дуудагдаж `teacher.clerkId`-г бөглөнө.
 */
export function TeacherClerkLinkEffect() {
  const [linkTeacherClerk] = useMutation(LINK_TEACHER_CLERK);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    void linkTeacherClerk().catch(() => {
      /* Уринаар үүссэн мөр байхгүй эсвэл аль хэдийн холбогдсон — алдааг харуулахгүй */
    });
  }, [linkTeacherClerk]);

  return null;
}
