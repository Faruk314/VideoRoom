import { useCallback } from "react";
import type {
  IChannelMessage,
  IChannelMessagesData,
} from "../../types/channelMessages";
import { useQueryClient } from "@tanstack/react-query";
import { updateMessagesInCache } from "../../utils/channelMessages";

export function useChannelMessageHandlers() {
  const queryClient = useQueryClient();

  const onChannelMessage = useCallback(
    (data: { message: IChannelMessage; channelId: string }) => {
      const { message, channelId } = data;
      const queryKey = ["channelMessages", channelId];

      queryClient.setQueryData(queryKey, (oldData: IChannelMessagesData) => {
        return updateMessagesInCache(oldData, message);
      });
    },
    [queryClient]
  );

  return { onChannelMessage };
}
