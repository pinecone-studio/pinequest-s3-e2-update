"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/header";
import ClassDetailScreen from "../../components/class-detail-screen";
import ClassListScreen from "../../components/class-list-screen";

function AngiContent() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("class");

  return classId ? (
    <ClassDetailScreen classId={classId} />
  ) : (
    <ClassListScreen />
  );
}

export default function TeacherAngiPage() {
  return (
    <div className="min-h-screen bg-teal-50 text-[#1f2a44]">
      <Header variant="tabs" activeView="review" />
      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-4 py-8 text-4 text-[#64748b]">
            Ачааллаж байна...
          </div>
        }
      >
        <AngiContent />
      </Suspense>
    </div>
  );
}
