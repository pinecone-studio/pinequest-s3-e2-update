"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const QuestionBankPage = dynamic(
  () =>
    import("../../_components/question-bank-page").then(
      (module) => module.QuestionBankPage,
    ),
  { ssr: false },
);

export default function QuestionBankDynamicPage() {
  const params = useParams<{ subjectId?: string; grade?: string }>();
  const subjectId =
    typeof params.subjectId === "string"
      ? decodeURIComponent(params.subjectId)
      : "";
  const grade =
    typeof params.grade === "string" ? decodeURIComponent(params.grade) : "";

  console.log(grade, subjectId);

  return <QuestionBankPage initialGrade={grade} initialSubjectId={subjectId} />;
}
