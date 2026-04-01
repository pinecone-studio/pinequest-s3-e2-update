"use client";

import { useParams } from "next/navigation";
import { TeacherClassDetail } from "@/app/teacher/_components/class-detail";

export default function TeacherClassPage() {
  const params = useParams();
  const classId = params.classId;

  if (!classId) {
    return (
      <section className="px-4 py-10 sm:px-10">
        <p className="text-center text-4 font-semibold text-[#475569]">
          Ангийн дугаар олдсонгүй.
        </p>
      </section>
    );
  }

  return <TeacherClassDetail classId={classId as string} />;
}
