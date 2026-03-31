/** @format */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getApprovalRequestsClient,
  getApprovalUpdatedEventName,
} from "@/app/lib/exam-approval-store";
import { ExamLifecycleSummary } from "./_components/ExamLifecycleSummary";
import { ExamScheduleCalendarSection } from "./_components/ExamScheduleCalendarSection";
import { ExamTableSection } from "./_components/ExamTableSection";
import {
  getExamLifecycleSummary,
  schoolExams,
} from "./_mock/school-exams";

export default function SchoolExamsPage() {
  const [approvalRequests, setApprovalRequests] = useState<
    ReturnType<typeof getApprovalRequestsClient>
  >([]);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const lifecycleSummary = getExamLifecycleSummary(schoolExams);
  const pendingApprovals = useMemo(
    () => approvalRequests.filter((item) => item.status === "pending"),
    [approvalRequests]
  );

  useEffect(() => {
    const sync = () => setApprovalRequests(getApprovalRequestsClient());
    sync();
    const eventName = getApprovalUpdatedEventName();
    window.addEventListener(eventName, sync);
    return () => window.removeEventListener(eventName, sync);
  }, []);

  return (
    <div className="space-y-6">
      <ExamLifecycleSummary
        summary={lifecycleSummary}
        onCreateSchedule={() => setIsScheduleDialogOpen(true)}
      />
      <ExamScheduleCalendarSection
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      />
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#0f172a]">
            Батлуулах шалгалтын хүсэлт ({pendingApprovals.length})
          </h3>
          <Link
            href="/school/requests"
            className="text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            Дэлгэрэнгүй харах →
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {pendingApprovals.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
            >
              {item.className} · {item.subject} · {item.title} · {item.teacherName}
            </div>
          ))}
          {pendingApprovals.length === 0 ? (
            <p className="text-sm text-zinc-500">Хүлээгдэж буй батлуулах хүсэлт алга.</p>
          ) : null}
        </div>
      </section>
      <ExamTableSection exams={schoolExams} />
    </div>
  );
}
