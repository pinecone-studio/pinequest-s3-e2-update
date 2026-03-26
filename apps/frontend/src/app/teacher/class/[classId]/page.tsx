"use client";

import { useParams } from "next/navigation";
import TeacherClassDetail from "../../components/teacher-class-detail";

export default function TeacherClassPage() {
  const params = useParams();
  const raw = params.classId;
  const classId = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");

  if (!classId) {
    return (
      <section className="px-4 py-10 sm:px-10">
        <p className="text-center text-4 font-semibold text-[#475569]">
          Ангийн дугаар олдсонгүй.
        </p>
      </section>
    );
  }

  return <TeacherClassDetail classId={classId} />;
}
