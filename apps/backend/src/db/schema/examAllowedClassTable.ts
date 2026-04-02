import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Ямар шалгалтыг аль ангиудад «илгээсэн» (сурагчийн кодоор орох эрхтэй). */
export const examAllowedClassTable = sqliteTable(
  "exam_allowed_class",
  {
    examId: text("examId").notNull(),
    classId: text("classId").notNull(),
    createdAt: text("createdAt").notNull(),
    /** Багш хяналтыг серверээс эхлүүлсэн цаг (ISO); шинэ илгээлтэд null хүртэл хүлээнэ. */
    sessionStartedAt: text("sessionStartedAt"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.examId, t.classId] }),
  }),
);
