import apiClient from "../../../lib/apiClient";
import type { IChannelMessage } from "../types/channelMessages";

const API_URL = "/api/channelMessages";

async function getChannelMessages(
  channelId: string,
  page = 0
): Promise<{
  messages: IChannelMessage[];
  currentPage: number;
  nextPage: number | null;
}> {
  const res = await apiClient.get(
    `${API_URL}/getChannelMessages/${channelId}`,
    {
      params: { page },
    }
  );

  return res.data;
}

export { getChannelMessages };
