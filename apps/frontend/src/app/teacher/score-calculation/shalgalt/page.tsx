"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import OverviewScreen from "../../components/overview-screen";
import ReviewScreen from "../../components/review-screen";
import StatsScreen from "../../components/stats-screen";

type TeacherView = "overview" | "review" | "stats";

function ShalgaltContent({
  activeView,
  setActiveView,
  studentCode,
}: {
  activeView: TeacherView;
  setActiveView: (v: TeacherView) => void;
  studentCode: string | null;
}) {
  const handleBack = () => {
    setActiveView("overview");
    window.history.replaceState({}, "", "/teacher/shalgalt");
  };

  return (
    <>
      {activeView === "overview" && (
        <OverviewScreen onOpenReview={() => setActiveView("review")} />
      )}
      {activeView === "review" && (
        <ReviewScreen onBack={handleBack} studentCode={studentCode} />
      )}
      {activeView === "stats" && <StatsScreen />}
    </>
  );
}

function ShalgaltInner() {
  const searchParams = useSearchParams();
  const studentCode = searchParams.get("student");
  const [activeView, setActiveView] = useState<TeacherView>("overview");

  useEffect(() => {}, [studentCode]);

  return (
    <div className="min-h-screen bg-teal-50 text-[#1f2a44]">
      <ShalgaltContent
        activeView={activeView}
        setActiveView={setActiveView}
        studentCode={studentCode}
      />
    </div>
  );
}

export default function TeacherShalgaltPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-teal-50 flex items-center justify-center text-4 text-[#64748b]">
          Ачааллаж байна...
        </div>
      }
    >
      <ShalgaltInner />
    </Suspense>
  );
}
