import { getChannelMessages } from "../api/channelMessages";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../../../hooks/useToast";
import { getErrorMessage } from "../../../lib/error";
import { useUserStore } from "../../user/store/user";
import type {
  IChannelMessage,
  IChannelMessagesData,
} from "../types/channelMessages";
import { useChannelMessageEmitters } from "../websocket/emitters/channelMessage";
import { updateMessagesInCache } from "../utils/channelMessages";

function useChannelMessagesQuery(channelId: string) {
  return useInfiniteQuery({
    queryKey: ["channelMessages", channelId],
    queryFn: ({ pageParam = 0 }) => getChannelMessages(channelId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
    enabled: !!channelId,
  });
}

function useCreateChannelMessageMutation() {
  const queryClient = useQueryClient();
  const { emitSendChannelMessage } = useChannelMessageEmitters();
  const { user } = useUserStore();
  const { toastError } = useToast();

  return useMutation({
    mutationFn: emitSendChannelMessage,
    onMutate: async (variables) => {
      const { channelId, content } = variables;
      const queryKey = ["channelMessages", channelId];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      if (!user) throw new Error("User must be logged in to send a message");

      const optimisticMessage = {
        id: crypto.randomUUID(),
        content,
        createdAt: new Date(),
        sender: { userId: user.userId, userName: user.userName },
        optimistic: true,
      };

      queryClient.setQueryData(queryKey, (oldData: IChannelMessagesData) => {
        return updateMessagesInCache(oldData, optimisticMessage);
      });

      return { previousData };
    },
    onSuccess: (response, variables) => {
      const data = response.data ?? response;
      const newMessage = {
        ...data,
      };

      const channelId = variables.channelId;
      const queryKey = ["channelMessages", channelId];

      queryClient.setQueryData(queryKey, (oldData: IChannelMessagesData) => {
        if (!oldData) return oldData;
        const lastPageIndex = oldData.pages.length - 1;

        const newPages = oldData.pages.map((page, i: number) => {
          if (i !== lastPageIndex) return page;

          const updatedMessages = page.messages.map((msg: IChannelMessage) =>
            msg.optimistic &&
            msg.sender?.userId === user?.userId &&
            msg.content === variables.content
              ? newMessage
              : msg
          );

          return { ...page, messages: updatedMessages };
        });

        return { ...oldData, pages: newPages };
      });
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["channelMessages", variables.channelId],
        context?.previousData
      );

      toastError(getErrorMessage(error));
    },
  });
}

export { useChannelMessagesQuery, useCreateChannelMessageMutation };
