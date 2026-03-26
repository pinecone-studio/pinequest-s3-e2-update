import type {
  Delivery,
  ExamTemplate,
  ExamTemplateStatus,
  StudentSubmission,
} from "./types";

const LS_KEY = "exam-management.local.v1";

/** `useSyncExternalStore` getServerSnapshot — ижил reference заавал байх ёстой. */
export const EMPTY_EXAM_TEMPLATES_SNAPSHOT: ExamTemplate[] = [];

let templatesListSnapshotCache: { raw: string | null; list: ExamTemplate[] } = {
  raw: "__init__",
  list: EMPTY_EXAM_TEMPLATES_SNAPSHOT,
};

type PersistedState = {
  templatesById: Record<string, ExamTemplate>;
  deliveriesById: Record<string, Delivery>;
  submissionsByDeliveryId: Record<string, StudentSubmission[]>;
  statusOrder: string[]; // template ids for stable list ordering
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function getDefaultState(): PersistedState {
  return { templatesById: {}, deliveriesById: {}, submissionsByDeliveryId: {}, statusOrder: [] };
}

export function loadState(): PersistedState {
  if (typeof window === "undefined") return getDefaultState();
  return safeParse(window.localStorage.getItem(LS_KEY), getDefaultState());
}

export function saveState(state: PersistedState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(state));
  templatesListSnapshotCache = { raw: "__stale__", list: EMPTY_EXAM_TEMPLATES_SNAPSHOT };
  window.dispatchEvent(new Event("exam-management.local.updated"));
}

export function upsertTemplate(template: ExamTemplate) {
  const state = loadState();
  state.templatesById[template.id] = template;
  if (!state.statusOrder.includes(template.id)) state.statusOrder.unshift(template.id);
  saveState(state);
}

export function listTemplates() {
  const state = loadState();
  const ids = state.statusOrder.length ? state.statusOrder : Object.keys(state.templatesById);
  const templates = ids.map((id) => state.templatesById[id]).filter(Boolean);
  return templates.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

/** `useSyncExternalStore` — түүхий raw өөрчлөгдөөгүй бол хуучин array reference буцаана. */
export function getTemplatesListSnapshot(): ExamTemplate[] {
  if (typeof window === "undefined") return EMPTY_EXAM_TEMPLATES_SNAPSHOT;
  const raw = window.localStorage.getItem(LS_KEY);
  if (raw === templatesListSnapshotCache.raw) return templatesListSnapshotCache.list;
  templatesListSnapshotCache = { raw, list: listTemplates() };
  return templatesListSnapshotCache.list;
}

export function getTemplateById(templateId: string): ExamTemplate | null {
  const state = loadState();
  return state.templatesById[templateId] ?? null;
}

export function updateTemplate(templateId: string, patch: Partial<ExamTemplate>) {
  const state = loadState();
  const cur = state.templatesById[templateId];
  if (!cur) return;
  state.templatesById[templateId] = {
    ...cur,
    ...patch,
    updatedAt: nowIso(),
  };
  if (!state.statusOrder.includes(templateId)) state.statusOrder.unshift(templateId);
  saveState(state);
}

export function setTemplateStatus(templateId: string, status: ExamTemplateStatus) {
  updateTemplate(templateId, { status });
}

export function archiveTemplate(templateId: string) {
  setTemplateStatus(templateId, "archived");
}

export function upsertDelivery(delivery: Delivery) {
  const state = loadState();
  state.deliveriesById[delivery.id] = delivery;
  saveState(state);
}

export function getDeliveryById(deliveryId: string): Delivery | null {
  const state = loadState();
  return state.deliveriesById[deliveryId] ?? null;
}

/** Нэг загварт холбогдсон илгээдүүд (жагсаалтаас урьдчилж харах линк үүсгэхэд). */
export function listDeliveriesForTemplate(templateId: string): Delivery[] {
  const state = loadState();
  return Object.values(state.deliveriesById)
    .filter((d) => d.templateId === templateId)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function updateDelivery(deliveryId: string, patch: Partial<Delivery>) {
  const state = loadState();
  const cur = state.deliveriesById[deliveryId];
  if (!cur) return;
  state.deliveriesById[deliveryId] = { ...cur, ...patch, updatedAt: nowIso() };
  saveState(state);
}

export function upsertSubmissions(deliveryId: string, submissions: StudentSubmission[]) {
  const state = loadState();
  state.submissionsByDeliveryId[deliveryId] = submissions;
  saveState(state);
}

export function getSubmissions(deliveryId: string): StudentSubmission[] {
  const state = loadState();
  return state.submissionsByDeliveryId[deliveryId] ?? [];
}

export function updateSubmission(deliveryId: string, studentSubmissionId: string, patch: Partial<StudentSubmission>) {
  const state = loadState();
  const list = state.submissionsByDeliveryId[deliveryId] ?? [];
  const idx = list.findIndex((s) => s.id === studentSubmissionId);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...patch };
  state.submissionsByDeliveryId[deliveryId] = list;
  saveState(state);
}

export function ensureTemplatesSeeded() {
  // Intentionally no auto-seeding; keeps demo deterministic for teachers.
  // This function exists so we can add seed later without changing page logic.
  return;
}

