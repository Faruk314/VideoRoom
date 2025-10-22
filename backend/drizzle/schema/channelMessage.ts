import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { id, createdAt, updatedAt } from "../schemaHelpers";
import { ChannelTable } from "./channel";

export const ChannelMessagesTable = pgTable("channel_messages", {
  id,
  content: text().notNull(),
  channelId: text()
    .notNull()
    .references(() => ChannelTable.id, { onDelete: "cascade" }),
  senderId: uuid()
    .notNull()
    .references(() => UserTable.userId, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const channelMessageRelations = relations(
  ChannelMessagesTable,
  ({ one }) => ({
    channel: one(ChannelTable, {
      fields: [ChannelMessagesTable.channelId],
      references: [ChannelTable.id],
    }),
    sender: one(UserTable, {
      fields: [ChannelMessagesTable.senderId],
      references: [UserTable.userId],
    }),
  })
);
