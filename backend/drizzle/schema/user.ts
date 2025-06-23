import { pgTable, text } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers";

export const UserTable = pgTable("users", {
  userId: id,
  email: text().notNull().unique(),
  userName: text().notNull(),
  image: text(),
  password: text().notNull(),
  salt: text().notNull(),
  createdAt,
  updatedAt,
});
