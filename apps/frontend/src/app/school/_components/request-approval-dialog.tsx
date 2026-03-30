"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getApprovalRequestsClient,
  getApprovalUpdatedEventName,
} from "@/app/lib/exam-approval-store";

export function RequestApprovalDialog() {
  const [requests, setRequests] = useState<ReturnType<typeof getApprovalRequestsClient>>([]);

  useEffect(() => {
    const sync = () => setRequests(getApprovalRequestsClient());
    sync();
    const eventName = getApprovalUpdatedEventName();
    window.addEventListener(eventName, sync);
    return () => window.removeEventListener(eventName, sync);
  }, []);

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "pending").length,
    [requests]
  );

  return (
    <Link
      href="/school/requests"
      className="rounded-xl border border-[#e6edf5] bg-[#f8fbff] p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-2 font-medium text-[#64748b]">Батлах хүсэлт</p>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
      </div>
      <p className="mt-2 text-4 font-bold text-[#0f172a]">{pendingCount}</p>
    </Link>
  );
}
