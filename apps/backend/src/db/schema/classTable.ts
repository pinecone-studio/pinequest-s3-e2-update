import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const classTable = sqliteTable("class", {
    id: text("id").primaryKey(),
    clerkId: text("clerkId").notNull(),
    email: text("email").notNull(),
    address: text("address").notNull(),
    register: integer("register").notNull(),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  });
  