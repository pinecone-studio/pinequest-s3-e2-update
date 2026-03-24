"use client";

import { useState } from "react";
import Header from "../components/header";
import OverviewScreen from "../components/overview-screen";
import ReviewScreen from "../components/review-screen";
import StatsScreen from "../components/stats-screen";

type TeacherView = "overview" | "review" | "stats";

export default function TeacherShalgaltPage() {
  const [activeView, setActiveView] = useState<TeacherView>("overview");

  return (
    <div className="min-h-screen bg-[#edf2f8] text-[#1f2a44]">
      <Header activeView={activeView} onChangeView={setActiveView} />
      {activeView === "overview" && <OverviewScreen onOpenReview={() => setActiveView("review")} />}
      {activeView === "review" && <ReviewScreen onBack={() => setActiveView("overview")} />}
      {activeView === "stats" && <StatsScreen />}
    </div>
  );
}
