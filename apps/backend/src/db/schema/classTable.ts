import { integer } from "drizzle-orm/sqlite-core";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const classTable = sqliteTable("class", {
    id: text("id").primaryKey(),
    schoolId: text("schoolId").notNull(),
    grade: integer("grade").notNull(),
    section: text("section").notNull(),
    sectionTeacherId: text("sectionTeacherId").notNull(),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });
  