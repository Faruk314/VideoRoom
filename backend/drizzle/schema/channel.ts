import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { ChannelMessagesTable } from "./channelMessage";
import { UserTable } from "./user";
import { nanoid } from "nanoid";

export const ChannelTable = pgTable("channels", {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid(8)),
  name: text(),
  ownerId: uuid()
    .notNull()
    .references(() => UserTable.userId, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const channelRelations = relations(ChannelTable, ({ one, many }) => ({
  messages: many(ChannelMessagesTable),
  owner: one(UserTable, {
    fields: [ChannelTable.ownerId],
    references: [UserTable.userId],
  }),
}));
