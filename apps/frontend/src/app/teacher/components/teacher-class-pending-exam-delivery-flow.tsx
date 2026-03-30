"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Student } from "@/app/lib/types";
import { markSavedExamDelivered } from "./teacher-class-detail-utils";
import { TeacherClassPendingExamDeliveryPanel } from "./teacher-class-pending-exam-delivery-panel";

type TeacherClassPendingExamDeliveryFlowProps = {
  classId: string;
  className: string;
  classPath: string;
  examId: string;
  examTitle: string;
  onComplete: (message: string) => void;
  students: Student[];
};

export function TeacherClassPendingExamDeliveryFlow({
  classId,
  className,
  classPath,
  examId,
  examTitle,
  onComplete,
  students,
}: TeacherClassPendingExamDeliveryFlowProps) {
  const router = useRouter();
  const [deliveryMode, setDeliveryMode] = useState<"all" | "sample">("all");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const toggleStudent = (studentId: string) =>
    setSelectedStudentIds((current) =>
      current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId],
    );

  const submitDelivery = () => {
    if (deliveryMode === "sample" && selectedStudentIds.length === 0) {
      onComplete("Түүвэр илгээхийн тулд дор хаяж нэг сурагч сонгоно уу.");
      return;
    }

    markSavedExamDelivered(examId, classId);
    const targetCount = deliveryMode === "all" ? students.length : selectedStudentIds.length;
    onComplete(
      deliveryMode === "all"
        ? `"${examTitle}" шалгалтыг ${className} ангийн бүх ${targetCount} сурагчид илгээлээ.`
        : `"${examTitle}" шалгалтыг ${targetCount} сурагчтай түүвэр бүлэгт илгээлээ.`,
    );
    router.replace(classPath);
  };

  return (
    <TeacherClassPendingExamDeliveryPanel
      className={className}
      deliveryMode={deliveryMode}
      examTitle={examTitle}
      onChangeDeliveryMode={setDeliveryMode}
      onClearSample={() => setSelectedStudentIds([])}
      onSelectAllSample={() => setSelectedStudentIds(students.map((student) => student.id))}
      onSubmit={submitDelivery}
      onToggleStudent={toggleStudent}
      selectedStudentIds={selectedStudentIds}
      students={students}
    />
  );
}
