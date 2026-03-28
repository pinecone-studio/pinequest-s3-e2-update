import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const openExerciesTable = sqliteTable("openExercies", {
    id: text("id").primaryKey(),
    title: text("title"),
    question: text("question"),
    answer: text("answer"),
    imageUrl: text("imageUrl"),
    difficulty: text("difficulty"),
    score: integer("score").notNull(),
    notes: text("notes"),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
});