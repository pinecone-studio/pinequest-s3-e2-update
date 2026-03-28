import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const subjectTable = sqliteTable("subject", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
