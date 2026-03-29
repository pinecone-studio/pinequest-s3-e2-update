import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const testTable = sqliteTable("test", {
  id: text("id").primaryKey(),
  grade: integer("grade"),
  subjectId: text("subjectId"),
  question: text("question").notNull(),
  answers: text("answers", { mode: "json" }),
  imageUrl: text("imageUrl"),
  rightAnswer: text("rightAnswer").notNull(),
  difficulty: text("difficulty").notNull(),
  score: integer("score").notNull(),
  usageCount: integer("usageCount").notNull().default(0),
  notes: text("notes"),
  teacherId: text("teacherId").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
