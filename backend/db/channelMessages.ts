import { ChannelMessagesTable } from "drizzle/schema/channelMessage";
import { db } from "drizzle/db";
import { eq } from "drizzle-orm";

async function insertChannelMessage(
  data: typeof ChannelMessagesTable.$inferInsert
) {
  const [newChannelMessage] = await db
    .insert(ChannelMessagesTable)
    .values(data)
    .onConflictDoNothing()
    .returning({
      id: ChannelMessagesTable.id,
      content: ChannelMessagesTable.content,
      createdAt: ChannelMessagesTable.createdAt,
    });

  if (newChannelMessage == null)
    throw new Error("Failed to insert chat message");

  return newChannelMessage;
}

async function getChannelMessages(channelId: string, page = 0) {
  const limit = 40;
  const offset = page * limit;

  const messages = await db.query.ChannelMessagesTable.findMany({
    columns: {
      id: true,
      content: true,
      createdAt: true,
    },
    where: eq(ChannelMessagesTable.channelId, channelId),
    with: {
      sender: {
        columns: {
          userId: true,
          userName: true,
        },
      },
    },
    orderBy: (ChannelMessagesTable, { desc }) => [
      desc(ChannelMessagesTable.createdAt),
    ],
    limit,
    offset,
  });

  const nextPage = messages.length === limit ? page + 1 : null;

  return { messages, currentPage: page, nextPage };
}

export { insertChannelMessage, getChannelMessages };
