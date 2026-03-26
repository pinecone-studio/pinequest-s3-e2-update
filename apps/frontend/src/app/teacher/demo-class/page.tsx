import { redirect } from "next/navigation";
import { TEACHER_DEMO_CLASS_ID } from "@/app/lib/teacher-demo-class";

export default function TeacherDemoClassRedirectPage() {
  redirect(`/teacher/class/${TEACHER_DEMO_CLASS_ID}`);
}
