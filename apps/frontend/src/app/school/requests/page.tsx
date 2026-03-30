"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type ApprovalRequest,
  getApprovalRequestsClient,
  getApprovalUpdatedEventName,
  updateApprovalRequestStatus,
} from "@/app/lib/exam-approval-store";

export default function SchoolRequestsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const pendingCount = useMemo(() => requests.filter((r) => r.status === "pending").length, [requests]);

  useEffect(() => {
    const sync = () => setRequests(getApprovalRequestsClient());
    sync();
    const eventName = getApprovalUpdatedEventName();
    window.addEventListener(eventName, sync);
    return () => window.removeEventListener(eventName, sync);
  }, []);

  const approveRequest = (id: string) => {
    updateApprovalRequestStatus(id, "approved");
    setRequests(getApprovalRequestsClient());
  };

  const rejectRequest = (id: string) => {
    const note = (comments[id] || "").trim();
    if (!note) return;
    updateApprovalRequestStatus(id, "needs_fix", note);
    setRequests(getApprovalRequestsClient());
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe5f0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-3 font-bold text-[#0f172a]">Батлуулах хүсэлтүүд</h2>
            <p className="mt-1 text-2 text-zinc-600">Хүлээгдэж буй хүсэлт: {pendingCount}</p>
          </div>
          <Link href="/school" className="inline-flex items-center gap-1 text-2 font-medium text-blue-700 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4" />
            Самбар руу буцах
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        {requests.map((request) => (
          <article key={request.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-zinc-900">
                {request.teacherName} · {request.className} · {request.subject}
              </p>
              <div className="flex items-center gap-2">
                {request.unread ? <span className="rounded-full bg-blue-100 px-2 py-1 text-2 font-medium text-blue-700">Шинэ</span> : null}
                {request.status === "pending" ? <span className="rounded-full bg-amber-100 px-2 py-1 text-2 font-medium text-amber-700">Хүлээгдэж байна</span> : null}
                {request.status === "approved" ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-2 font-medium text-emerald-700">Баталсан</span> : null}
                {request.status === "needs_fix" ? <span className="rounded-full bg-red-100 px-2 py-1 text-2 font-medium text-red-700">Дутуу - буцаасан</span> : null}
              </div>
            </div>

            <div className="mt-2 space-y-1 text-2 text-zinc-700">
              <p>Шалгалт: {request.title}</p>
              <p>Материал: {request.materialTitle}</p>
              <p>Илгээсэн: {request.sentAt}</p>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [request.id]: !prev[request.id] }))}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-2 font-medium text-blue-700 hover:bg-blue-100"
              >
                {expanded[request.id] ? "Дэлгэрэнгүйг хаах" : "Дэлгэрэнгүй харах"}
              </button>
            </div>

            {expanded[request.id] ? (
              <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                <p className="font-medium text-zinc-800">Асуулт, хариулт ({request.questions.length})</p>
                <div className="mt-2 max-h-60 space-y-2 overflow-y-auto pr-1">
                  {request.questions.map((qa) => (
                    <div key={`${request.id}-q-${qa.id}`} className="rounded-lg border border-[#c9d5ea] bg-white p-3">
                      <p className="text-2 font-semibold text-[#5f739b]">Асуулт {qa.id}</p>
                      <p className="mt-1 text-2 font-semibold text-[#24314f]">{qa.question}</p>

                      <div className="mt-3 space-y-2">
                        {qa.options.map((option) => {
                          const isCorrect = option.key === qa.correctOption;
                          return (
                            <div
                              key={`${request.id}-q-${qa.id}-${option.key}`}
                              className={`flex items-center gap-3 rounded-lg border p-2 ${
                                isCorrect
                                  ? "border-emerald-300 bg-emerald-50"
                                  : "border-[#c9d5ea] bg-white"
                              }`}
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9edf5] font-semibold text-[#4b5f87]">
                                {option.key}
                              </span>
                              <p className="text-2 font-medium text-[#2f4066]">{option.text}</p>
                              {isCorrect ? (
                                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-2 font-medium text-emerald-700">
                                  Зөв
                                </span>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {request.status === "pending" ? (
              <div className="mt-3">
                <label className="block text-2 font-medium text-zinc-600">
                  Тайлбар (дутуу бол заавал бичнэ)
                  <textarea
                    value={comments[request.id] ?? ""}
                    onChange={(e) => setComments((prev) => ({ ...prev, [request.id]: e.target.value }))}
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-2 text-zinc-900"
                  />
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={() => approveRequest(request.id)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-2 font-semibold text-white hover:bg-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Батлах
                  </button>
                  <button type="button" onClick={() => rejectRequest(request.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-2 font-semibold text-white hover:bg-red-700">
                    <XCircle className="h-4 w-4" />
                    Дутуу гэж буцаах
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
