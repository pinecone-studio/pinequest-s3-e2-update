"use client";

export type ApprovalRequestStatus = "pending" | "approved" | "needs_fix";

export type ApprovalQuestionOption = {
  key: "A" | "B" | "C" | "D";
  text: string;
};

export type ApprovalQuestion = {
  id: number;
  question: string;
  options: ApprovalQuestionOption[];
  correctOption: "A" | "B" | "C" | "D";
};

export type ApprovalRequest = {
  id: string;
  examId: string;
  title: string;
  className: string;
  requestedExamDate?: string;
  requestedStartTime?: string;
  requestedEndTime?: string;
  requestedLocation?: string;
  subject: string;
  teacherName: string;
  materialTitle: string;
  sentAt: string;
  unread?: boolean;
  status: ApprovalRequestStatus;
  comment?: string;
  questions: ApprovalQuestion[];
};

const STORAGE_KEY = "school-approval-requests-v1";
const UPDATED_EVENT = "approval-requests.updated";

const optionKeys: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

function buildQuestions(subject: string, title: string, count = 20): ApprovalQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    question: `${subject} - ${title} | Асуулт ${i + 1}`,
    options: [
      { key: "A", text: `${subject} ${i + 1}-A хувилбар` },
      { key: "B", text: `${subject} ${i + 1}-B хувилбар` },
      { key: "C", text: `${subject} ${i + 1}-C хувилбар` },
      { key: "D", text: `${subject} ${i + 1}-D хувилбар` },
    ],
    correctOption: optionKeys[i % 4],
  }));
}

const seedRequests: ApprovalRequest[] = [
  {
    id: "req-seed-10a",
    examId: "exam-seed-10a",
    title: "Алгебр I улирал",
    className: "10А",
    requestedExamDate: "2026-04-03",
    requestedStartTime: "09:00",
    requestedEndTime: "10:00",
    requestedLocation: "203",
    subject: "Математик",
    teacherName: "Б.Эрдэнэ",
    materialTitle: "Хуваарь + бодлого A",
    sentAt: "2026-03-30 16:05",
    unread: true,
    status: "pending",
    questions: buildQuestions("Математик", "Алгебр I улирал"),
  },
  {
    id: "req-seed-9b",
    examId: "exam-seed-9b",
    title: "Эх бичиг шалгалт",
    className: "9Б",
    requestedExamDate: "2026-04-04",
    requestedStartTime: "11:00",
    requestedEndTime: "11:35",
    requestedLocation: "205",
    subject: "Монгол хэл",
    teacherName: "О.Наранзул",
    materialTitle: "Уншлага + богино хариулт",
    sentAt: "2026-03-30 10:05",
    status: "pending",
    questions: buildQuestions("Монгол хэл", "Эх бичиг шалгалт"),
  },
];

function dispatchUpdatedEvent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

function parse(raw: string | null): ApprovalRequest[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data as ApprovalRequest[];
  } catch {
    return [];
  }
}

export function getApprovalRequestsClient(): ApprovalRequest[] {
  if (typeof window === "undefined") return seedRequests;
  const current = parse(window.localStorage.getItem(STORAGE_KEY));
  if (current.length > 0) return current;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRequests));
  return seedRequests;
}

function setApprovalRequestsClient(next: ApprovalRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  dispatchUpdatedEvent();
}

export function getApprovalUpdatedEventName() {
  return UPDATED_EVENT;
}

export function upsertPendingApprovalRequest(input: {
  examId: string;
  title: string;
  className: string;
  requestedExamDate?: string;
  requestedStartTime?: string;
  requestedEndTime?: string;
  requestedLocation?: string;
  subject: string;
  teacherName: string;
  materialTitle?: string;
  sentAt?: string;
  questionCount?: number;
}) {
  const list = getApprovalRequestsClient();
  const request: ApprovalRequest = {
    id: `req-${input.examId}`,
    examId: input.examId,
    title: input.title,
    className: input.className,
    requestedExamDate: input.requestedExamDate,
    requestedStartTime: input.requestedStartTime,
    requestedEndTime: input.requestedEndTime,
    requestedLocation: input.requestedLocation,
    subject: input.subject,
    teacherName: input.teacherName,
    materialTitle: input.materialTitle || `${input.subject} шалгалтын материал`,
    sentAt: input.sentAt || new Date().toISOString().slice(0, 16).replace("T", " "),
    unread: true,
    status: "pending",
    questions: buildQuestions(input.subject, input.title, input.questionCount ?? 20),
  };
  const next = [request, ...list.filter((item) => item.examId !== input.examId)];
  setApprovalRequestsClient(next);
}

export function updateApprovalRequestStatus(
  id: string,
  status: ApprovalRequestStatus,
  comment?: string
) {
  const list = getApprovalRequestsClient();
  const next = list.map((item) =>
    item.id === id ? { ...item, status, comment, unread: false } : item
  );
  setApprovalRequestsClient(next);
}

export function markAllApprovalRequestsRead() {
  const list = getApprovalRequestsClient();
  let changed = false;
  const next = list.map((item) => {
    if (item.unread) {
      changed = true;
      return { ...item, unread: false };
    }
    return item;
  });
  if (changed) setApprovalRequestsClient(next);
}
