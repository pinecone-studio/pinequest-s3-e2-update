import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const schoolTable = sqliteTable("school", {
  id: text("id").primaryKey(),
  clerkId: text("clerkId").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  register: integer("register").notNull(),
  provinceOrCity: text("provinceOrCity").notNull(),
  soumOrDistrict: text("soumOrDistrict").notNull(),
  /** Дэлгэрэнгүй хаяг (гудамж, байр, тоот) — form-ийн organizationAddressDetail */
  address: text("address").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
