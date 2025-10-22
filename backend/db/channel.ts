import { ChannelTable } from "drizzle/schema/channel";
import { db } from "drizzle/db";
import { eq } from "drizzle-orm";

async function insertChannel(
  data: typeof ChannelTable.$inferInsert,
  trx: Omit<typeof db, "$client">
) {
  const [newChannel] = await trx
    .insert(ChannelTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  if (newChannel == null) throw new Error("Failed to insert channel");

  return newChannel;
}

async function deleteChannel(channelId: string) {
  const deleted = await db
    .delete(ChannelTable)
    .where(eq(ChannelTable.id, channelId))
    .returning();

  if (deleted.length === 0) {
    return console.error("Channel not found or could not be deleted");
  }

  return deleted[0];
}

export { insertChannel, deleteChannel };
