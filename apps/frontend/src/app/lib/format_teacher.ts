import { store } from "@/app/lib/store";
/** Жагсаалт, товч текстэнд: «Нэр (Мэргэжил)» */
export function teacherLineById(id: string): string {
  const u = store.getUser(id);
  if (!u) return id;
  const s = u.specialty?.trim();
  return s ? `${u.name} (${s})` : u.name;
}