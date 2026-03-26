/**
 * Жишээ өгөгдөл — дараа нь жинхэнэ API эсвэл статик жагсаалтаар солино.
 */
export type MockHot = { label: string; sums: string[] };

export type MockAimag = { label: string; hots: MockHot[] };

export const MOCK_AimagHotSum: MockAimag[] = [
  {
    label: "Улаанбаатар хот",
    hots: [
      {
        label: "Нийслэл",
        sums: ["Баянзүрх дүүрэг", "Сүхбаатар дүүрэг", "Хан-Уул дүүрэг"],
      },
    ],
  },
  {
    label: "Архангай",
    hots: [
      {
        label: "Цэцэрлэг",
        sums: ["Батцэнгэл", "Булган", "Эрдэнэмандал"],
      },
      {
        label: "Дэлгэрээнгуй",
        sums: ["Төв суурин", "Рашаант"],
      },
      {
        label: "Тариат",
        sums: ["Тариат", "Өлзийт"],
      },
    ],
  },
  {
    label: "Увс",
    hots: [
      {
        label: "Улаангом",
        sums: ["Зүүнхангай", "Тариалан"],
      },
      {
        label: "Давст",
        sums: ["Хувийн", "Хяргас"],
      },
    ],
  },
];

/** Radix Select-ийн утга — аймаг, хотын нэрт шууд таслагдашгүй тусгаарлалт */
const REGION_PAIR_SEP = "\u001f";

export function regionKey(aimag: string, hot: string): string {
  return `${aimag}${REGION_PAIR_SEP}${hot}`;
}

export function parseRegionKey(
  key: string,
): { aimag: string; hot: string } | null {
  const i = key.indexOf(REGION_PAIR_SEP);
  if (i <= 0 || i >= key.length - 1) return null;
  return {
    aimag: key.slice(0, i),
    hot: key.slice(i + REGION_PAIR_SEP.length),
  };
}

export function listMockRegions(): {
  key: string;
  label: string;
  sums: string[];
}[] {
  const out: { key: string; label: string; sums: string[] }[] = [];
  for (const a of MOCK_AimagHotSum) {
    for (const h of a.hots) {
      out.push({
        key: regionKey(a.label, h.label),
        label: `${a.label} — ${h.label}`,
        sums: h.sums,
      });
    }
  }
  return out;
}
