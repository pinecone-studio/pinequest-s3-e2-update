import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const schoolTable = sqliteTable("school", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
});